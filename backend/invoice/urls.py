from django.urls import path
from django.contrib.auth.decorators import login_required

from invoice.views import invoice_list, invoice_preview, invoice_add, invoice_print, invoice_edit, order_list, \
    order_details, generate_invoice, invoice_detail, send_invoice, send_message, send_sms, get_load_info, \
    send_sms_message

app_name = 'invoice'

urlpatterns = [
    path('list', invoice_list, name='invoice-list'),
    path('preview/', invoice_preview, name='invoice-preview'),
    path('add/', invoice_add, name='invoice-add'),
    path('print/', invoice_print, name='invoice-print'),
    path('edit/', invoice_edit, name='invoice-edit'),
    path('order-list/', order_list, name='order-list'),
    path('order/<int:order_id>/', order_details, name='order-details'),
    path('order/<int:order_id>/generate-invoice/', generate_invoice, name='generate_invoice'),
    path('<int:invoice_id>/', invoice_detail, name='invoice_detail'),
    path('send-invoice/', send_invoice, name='send_invoice'),
    path('send-message/', send_message, name='send_message'),
    path('<int:invoice_id>/send-sms/', send_sms, name='send_sms'),

    path('order/<int:order_id>/load-info/', get_load_info, name='get_load_info'),
    path('order/<int:order_id>/send-sms-message/', send_sms_message, name='send_sms'),

]
