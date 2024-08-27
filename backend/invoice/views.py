from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404, redirect
from django.views.decorators.http import require_http_methods, require_POST
from django.views.generic import TemplateView
from twilio.rest import Client

from backend.sms_utils import send_sms
from invoice.models import Invoice
from store.models import Order, Load

from django.core.mail import EmailMessage
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.uploadedfile import InMemoryUploadedFile
import io

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.conf import settings
import json


@login_required
def invoice_list(request):
    context = {
        'section': 'invoice-list'
    }
    return render(request, "invoice/app-invoice-list.html", context)


def generate_invoice(request, order_id):
    order = get_object_or_404(Order, id=order_id)

    if not order.invoice:
        invoice = Invoice.objects.create(order=order)
        order.invoice = invoice
        order.save()
    return redirect('invoice:invoice_detail', invoice_id=order.invoice.id)


# @login_required
# def invoice_detail(request, invoice_id):
#     invoice = get_object_or_404(Invoice, id=invoice_id)
#     context = {
#         'section': 'invoice-list',
#         'invoice': invoice
#     }
#     return render(request, 'invoice/app-invoice-detail.html', context)


# @login_required
# def invoice_detail(request, invoice_id):
#     invoice = get_object_or_404(Invoice, id=invoice_id)
#
#     if request.method == 'POST' and request.headers.get('X-Requested-With') == 'XMLHttpRequest':
#         message = request.POST.get('sms-message')
#         client_phone = request.POST.get('user-phone')
#
#         print("Message", message)
#         print("client_phone", client_phone)
#
#         success, result = send_sms(client_phone, message)
#
#         if success:
#             return JsonResponse({'success': True, 'message': 'SMS sent successfully'})
#         else:
#             return JsonResponse({'success': False, 'error': result})
#
#     context = {
#         'section': 'invoice-list',
#         'invoice': invoice
#     }
#     return render(request, 'invoice/app-invoice-detail.html', context)

@login_required
@require_http_methods(["GET", "POST"])
def invoice_detail(request, invoice_id):
    invoice = get_object_or_404(Invoice, id=invoice_id)

    if request.method == 'POST' and request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        try:
            data = json.loads(request.body)
            message = data.get('message')
            client_phone = invoice.client.phone  # Get the phone number from the client object

            print("Message", message)
            print("client_phone", client_phone)

            if not message or not client_phone:
                return JsonResponse({'success': False, 'error': 'Missing message or phone number'})

            success, result = send_sms(client_phone, message)

            if success:
                return JsonResponse({'success': True, 'message': 'SMS sent successfully'})
            else:
                return JsonResponse({'success': False, 'error': result})
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON data'})

    context = {
        'section': 'invoice-list',
        'invoice': invoice
    }
    return render(request, 'invoice/app-invoice-detail.html', context)


@login_required
def send_message(request):
    context = {
        'section': 'send-message',
    }
    return render(request, 'invoice/app-send-message.html', context)


@csrf_exempt
def send_invoice(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        invoice_id = data.get('invoiceId')
        # from_email = data.get('from')
        from_email = settings.EMAIL_HOST_USER
        to_email = data.get('to')
        subject = data.get('subject')
        message = data.get('message')

        print("from_email", from_email)
        print("to_email", to_email)
        print("subject", subject)
        print("message", message)
        print("invoice_id", invoice_id)

        try:
            invoice = Invoice.objects.get(id=invoice_id)

            # Generate PDF
            from backend.utils import generate_pdf
            pdf_file = generate_pdf(invoice)

            # Render email template
            email_body = render_to_string('invoice/email_template.html', {
                'invoice': invoice,
                'message': message,
            })

            # Create email
            email = EmailMessage(
                subject,
                email_body,
                from_email,
                [to_email],
                reply_to=[from_email],
            )
            email.attach(f'invoice_{invoice.number}.pdf', pdf_file, 'application/pdf')

            # Send email
            email.send()

            # Update invoice status
            invoice.status = 'EMAIL_SENT'
            invoice.save()

            return JsonResponse({'success': True})
        except Exception as e:
            print("Error", e)
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'error': 'Invalid request method'})


@login_required
def invoice_preview(request):
    context = {
        'section': 'invoice-preview'
    }
    return render(request, "invoice/app-invoice-preview.html", context)


@login_required
def invoice_edit(request):
    context = {
        'section': 'invoice-edit'
    }
    return render(request, "invoice/app-invoice-edit.html", context)


@login_required
def invoice_add(request):
    context = {
        'section': 'invoice-add'
    }
    return render(request, "invoice/app-invoice-add.html", context)


@login_required
def invoice_print(request):
    context = {
        'section': 'invoice-print'
    }
    return render(request, "invoice/app-invoice-print.html", context)


@login_required
def order_list(request):
    orders = Order.objects.all().order_by('-created_at')
    context = {
        'section': 'order-list',
        'orders': orders
    }
    return render(request, "invoice/order-list.html", context)


@login_required
def order_details(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    loads = Load.objects.filter(order=order)
    total_quantity = sum(load.quantity for load in loads)
    images = order.images.all()

    context = {
        'section': 'order-detail',
        'order': order,
        'loads': loads,
        'total_loads': loads.count(),
        'total_quantity': total_quantity,
        'images' : images
    }
    return render(request, "invoice/order-details.html", context)


# def get_load_info(request, order_id):
#     order = get_object_or_404(Order, id=order_id)
#     loads = order.loads.all()
#
#     if not loads:
#         return JsonResponse({'error': 'No load information found for this order'}, status=404)
#
#     load_data = []
#     for load in loads:
#         load_data.append({
#             'quantity': load.quantity,
#             'address': load.address,
#             'date': load.date.strftime('%Y-%m-%d'),
#             'time': load.time.strftime('%H:%M'),
#         })
#
#     data = {
#         'customer_name': order.user.get_full_name() or order.user.username,
#         'customer_phone': order.user.phone if hasattr(order.user, 'profile') else '',
#         'order_number': order.order_number,
#         'loads': load_data,
#     }
#
#     return JsonResponse(data)

def get_load_info(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    loads = order.loads.all()

    if not loads:
        return JsonResponse({'error': 'No load information found for this order'}, status=404)

    load_data = []
    for load in loads:
        load_data.append({
            'quantity': load.quantity,
            'address': load.address,
            'date': load.date.strftime('%Y-%m-%d'),
            'time': load.time.strftime('%H:%M'),
        })

    data = {
        'customer_name': order.user.get_full_name() or order.user.username,
        'customer_phone': order.user.phone if hasattr(order.user, 'profile') else '',
        'order_number': order.order_number,
        'loads': load_data,
    }

    return JsonResponse(data)


@csrf_exempt
@require_POST
def send_sms_message(request, order_id):
    data = json.loads(request.body)
    message = data.get('message')

    # Fetch the order and related information
    order = get_object_or_404(Order, id=order_id)
    phone_number = order.user.phone if hasattr(order.user, 'profile') else ''

    if not phone_number:
        return JsonResponse({'success': False, 'error': 'No phone number available'})

    # Initialize Twilio client
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

    try:
        # Send SMS
        message = client.messages.create(
            body=message,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=phone_number
        )
        return JsonResponse({'success': True, 'message_sid': message.sid})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})
