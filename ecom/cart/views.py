from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
import json
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from products.models import Product
from orders.models import Order
from django.contrib.auth.models import User
User = get_user_model()

def update_cart(request):
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body)
            product_id = data.get('product_id')
            action = data.get('action')  # 'increase' or 'decrease'
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data'}, status=400)

        if not product_id or not action:
            return JsonResponse({'status': 'error', 'message': 'Product ID and action are required'}, status=400)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Product not found'}, status=404)

        cart = request.session.get('cart', {})

        if product_id in cart:
            if action == 'increase':
                # Check if product is in stock before increasing quantity
                if product.pqty <= cart[product_id]['quantity']:
                    return JsonResponse({
                        'status': 'out_of_stock',
                        'message': 'This product is out of stock'
                    })
                cart[product_id]['quantity'] += 1
            elif action == 'decrease':
                if cart[product_id]['quantity'] > 1:
                    cart[product_id]['quantity'] -= 1
                else:
                    del cart[product_id]  # Remove item if quantity is 0

        # Save the updated cart back to the session
        request.session['cart'] = cart
        request.session.modified = True

        return JsonResponse({
            'status': 'success',
            'cart': cart,
            'total_items': sum(item['quantity'] for item in cart.values()),
            'total_price': sum(item['price'] * item['quantity'] for item in cart.values())
        })
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)

def clear_cart(request):
    if 'cart' in request.session:
        del request.session['cart']
    return JsonResponse({'status': 'success'})

def cart(request):
    cart = request.session.get('cart', {})

    total_items = sum(item['quantity'] for item in cart.values())
    total_price = sum(item['price'] * item['quantity'] for item in cart.values())

    return render(request, 'cart/cart.html', {
        'cart': cart,
        'total_items': total_items,
        'total_price': total_price
    })
@login_required
def userdetails(request):
    return render(request,'cart/userdetails.html',{'user': request.user})

@login_required
def payment(request):
    cart = request.session.get('cart', {})

    total_items = sum(item['quantity'] for item in cart.values())
    total_price = sum(item['price'] * item['quantity'] for item in cart.values())
    tax = round(0.02 * total_price, 2) 
    if total_price >500:
        total_payment = round(tax + total_price, 2)
    else:
        total_payment = round(tax + 20 + total_price, 2)

    return render(request, 'cart/payment.html', {
        'cart': cart,
        'total_items': total_items,
        'total_price': total_price,
        'tax': tax,
        'total_payment': total_payment
    })

@csrf_exempt
@login_required
def create_order(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            cart = request.session.get('cart', {})

            cart_items = []
            for product_id, item in cart.items():
                 try:
                    product = Product.objects.get(id=product_id)
                    if product.pqty < item['quantity']:
                        return JsonResponse({
                            'success': False,
                            'error': f'Not enough stock for {product.pname}'
                        }, status=400)
                    
                    # Reduce product quantity
                    product.pqty -= item['quantity']
                    product.save()
                    
                    cart_items.append({
                        'product_id': product_id,
                        'name': product.pname,
                        'price': float(item['price']),
                        'quantity': item['quantity']
                    })
                 except Product.DoesNotExist:
                    return JsonResponse({
                        'success': False,
                        'error': f'Product {product_id} not found'
                    }, status=404)
            
            # Create order
            order = Order.objects.create(
                user=request.user,
                user_name=data.get('user_name'),
                user_phone=data.get('user_phone'),
                total_amount=data.get('total_amount'),
                items=cart_items,
                delivery_address=data.get('delivery_address'),
                status='PENDING'
            )

            if 'cart' in request.session:
                del request.session['cart']
                del request.session['total_payment']
                request.session.modified = True
            
            return JsonResponse({
                'success': True, 
                'order_id': str(order.order_id)
            })
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    
    return JsonResponse({'success': False, 'error': 'Invalid request'})