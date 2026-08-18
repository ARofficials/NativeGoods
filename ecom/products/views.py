from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Product
from django.contrib.auth.decorators import login_required

@login_required
def add_product(request):
    if request.method == "POST":
        pname = request.POST.get("name")
        pdesc = request.POST.get("description")
        cmp_name = request.POST.get("companyName")
        pprice = request.POST.get("price")
        user = request.user
        pqty = request.POST.get("quantity")
        category = request.POST.get('category')
        image = request.FILES.get('imageInput')
        
        # Validate data (Optional)
        if not (pname and pdesc and cmp_name and pprice and pqty):
            return JsonResponse({"error": "All fields are required"}, status=400)

        # Save product to database
        product = Product(
            pname=pname,
            pdesc=pdesc,
            cmp_name=cmp_name,
            user=user,
            pprice=float(pprice),
            pqty=int(pqty),
            category = category,
            image=image
        )
        product.save()

        return JsonResponse({"message": "Product added successfully!"})

    return render(request, "products/add_product.html")  # Render the form page
