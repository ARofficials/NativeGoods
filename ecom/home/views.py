import os
import uuid
import json
from urllib.parse import unquote
from django.contrib.auth import get_user_model
from django.forms import ValidationError
from django.shortcuts import render,redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.shortcuts import render, get_object_or_404
from django.core.files.base import ContentFile
from django.contrib.auth.models import User
from .models import Review
from orders.models import Order
from products.models import Product
from django.contrib import messages

User = get_user_model()

def home(request):
    # Fetch all products from the database
    products = Product.objects.all()
    return render(request, 'home/home.html', {'user_name': request.user.username,'products': products,})

def category(request):
    # Get the category from the URL parameter and decode it
    category_name = unquote(request.GET.get('category', ''))
    print("Category Name:", category_name)  # Debugging
    
    # Filter products by category
    products = Product.objects.filter(category=category_name, delete_status=Product.LIVE)
    print("Filtered Products:", products)  # Debugging
    
    # Pass the category name and filtered products to the template
    context = {
        'category_name': category_name,
        'products': products,
    }
    return render(request, 'home/category.html',context)

@login_required
def profile(request):
    products = Product.objects.filter(user=request.user)#fetchingAllPrdsFromDbOfUser
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    company_name = products[0].cmp_name if products else "No company name available"
    user_reviews = Review.objects.filter(user=request.user).select_related('product')
    return render(request, 'home/profile.html', {'user': request.user,'products': products,'company_name': company_name,'orders': orders,'user_reviews': user_reviews,})

@login_required
@csrf_exempt
def update_profile(request):
    if request.method == 'POST':
        user = request.user
        data = request.POST
        print("Received Data:", data)


        # Update user fields
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.phone_number = data.get('phone', user.phone_number)
        user.address = data.get('address', user.address)
        
        # for debugging print statements
        print("Updated User Fields:")
        print("Username:", user.username)
        print("Email:", user.email)
        print("First Name:", user.first_name)
        print("Last Name:", user.last_name)
        print("Phone:", user.phone_number)
        print("Address:", user.address)

        # Check if username already exists
        if User.objects.exclude(pk=user.pk).filter(username=user.username).exists():
            return JsonResponse({'error': 'Username already exists.'}, status=400)

        # Update company name in the Product model
        new_company_name = data.get('company_name')
        print("New Company Name:", new_company_name)
        if new_company_name:
            # Update the company name for all products linked to the user
            products = Product.objects.filter(user=user)
            products.update(cmp_name=new_company_name)

        # Handle profile picture upload
        if 'imageUpload' in request.FILES:
            try:
                image = request.FILES['imageUpload']
                allowed_types = ['image/jpeg', 'image/png', 'image/gif']
                if image.content_type not in allowed_types:
                    raise ValidationError('Invalid file type. Only JPEG, PNG, and GIF are allowed.')
                file_ext = os.path.splitext(image.name)[1]  # Get file extension
                unique_name = f'{user.username}_{uuid.uuid4()}{file_ext}'
                file_path = f'profile_pictures/{unique_name}'

                # Delete the old profile picture if it exists
                if user.profile_picture:
                    if default_storage.exists(user.profile_picture.name):
                        default_storage.delete(user.profile_picture.name)

                # Save the new file
                file_name = default_storage.save(file_path, ContentFile(image.read()))

                # Update the user's profile picture
                user.profile_picture = file_name
            except ValidationError as e:
                return JsonResponse({'error': str(e)}, status=400)
            except Exception as e:
                return JsonResponse({'error': 'An error occurred while uploading the file.'}, status=500)
        user.save()
        print("User saved successfully!")

        return JsonResponse({'message': 'Profile updated successfully!'})
    return JsonResponse({'error': 'Invalid request method.'}, status=400)

@login_required
@csrf_exempt
def remove_profile_picture(request):
    if request.method == 'POST':
        try:
            user = request.user

            # Delete the profile picture if it exists
            if user.profile_picture:
                if default_storage.exists(user.profile_picture.name):
                    default_storage.delete(user.profile_picture.name)
                user.profile_picture = None
                user.save()

            return JsonResponse({'message': 'Profile picture removed successfully!'})
        except Exception as e:
            print("Error:", str(e))
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method.'}, status=400)

def product_detail(request, product_id):
    # Fetch the product or return a 404 error if not found
    product = get_object_or_404(Product, id=product_id)
    user_review = None
    if request.user.is_authenticated:
        user_review = Review.objects.filter(product=product, user=request.user).first()
    return render(request, 'home/product_detail.html', {
        'product': product,'user_review': user_review,'reviews': product.reviews.all().order_by('-created_at')
    })

@login_required
def submit_review(request, product_id):
    if request.method == 'POST':
        product = get_object_or_404(Product, id=product_id)
        rating = request.POST.get('rating')
        text = request.POST.get('text', '').strip()
        
        if not text:
            messages.error(request, "Review text cannot be empty")
            return redirect('product_detail', product_id=product_id)
        
        Review.objects.update_or_create(
            product=product,
            user=request.user,
            defaults={
                'rating': rating,
                'text': text
            }
        )
        messages.success(request, "Your review has been submitted!")
        return redirect('product_detail', product_id=product_id)
    return redirect('product_detail', product_id=product_id)

@login_required
def delete_review(request, review_id):
    """Delete a specific review (from profile page)"""
    review = get_object_or_404(Review, id=review_id, user=request.user)
    if request.method == 'POST':
        review.delete()
        messages.success(request, "Your review has been deleted")
    return redirect('profile')

@login_required
def delete_review_by_product(request, product_id):
    """Delete review for a specific product (from product page)"""
    review = get_object_or_404(Review, product_id=product_id, user=request.user)
    if request.method == 'POST':
        review.delete()
        messages.success(request, "Your review has been deleted")
        return redirect('product_detail', product_id=product_id)
    return redirect('product_detail', product_id=product_id)

@csrf_exempt
def add_to_cart(request):
    if request.method == 'POST':
        print("Received POST request to add to cart")  # Debugging
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body)
            product_id = data.get('product_id')
            print(f"Product ID: {product_id}")  # Debugging

            if not product_id:
                return JsonResponse({'status': 'error', 'message': 'Product ID is required'}, status=400)

            try:
                product = Product.objects.get(id=product_id)
                print(f"Product found: {product.pname}")  # Debugging
                
                # Check stock availability
                if product.pqty <= 0:
                    return JsonResponse({
                        'status': 'out_of_stock',
                        'message': 'This product is out of stock'
                    })

                # Get or initialize the cart in the session
                cart = request.session.get('cart', {})
                print(f"Current cart: {cart}")  # Debugging

                # Check if adding would exceed available stock
                current_quantity = cart.get(str(product_id), {}).get('quantity', 0)
                if current_quantity >= product.pqty:
                    return JsonResponse({
                        'status': 'out_of_stock',
                        'message': 'Cannot add more than available stock'
                    })

                # Update the cart
                if str(product_id) in cart:
                    cart[str(product_id)]['quantity'] += 1
                else:
                    cart[str(product_id)] = {
                        'name': product.pname,
                        'price': float(product.pprice),
                        'quantity': 1,
                        'image': product.image.url if product.image else ''
                    }

                # Save the cart back to the session
                request.session['cart'] = cart
                request.session.modified = True
                print(f"Updated cart: {cart}")  # Debugging

                return JsonResponse({
                    'status': 'success',
                    'cart': cart,
                    'total_items': sum(item['quantity'] for item in cart.values())
                })

            except Product.DoesNotExist:
                print("Product not found")
                return JsonResponse({'status': 'error', 'message': 'Product not found'}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data'}, status=400)
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)

def contact(request):
    return render(request, 'home/contact.html')
def terms(request):
    return render(request, 'home/terms.html')
def about(request):
    return render(request, 'home/about.html')
def faq(request):
    return render(request, 'home/faq.html')

@login_required
def delete_product(request, product_id):
    product = get_object_or_404(Product, id=product_id, user=request.user)
    product.delete()
    return redirect("profile")  # Redirect back to the profile page

