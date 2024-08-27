# views.py

from django.shortcuts import render, redirect
from django.views import View

from store.models import Load
from .models import Client, Delivery, Sale, SESCO, Commission, GrossProfit
from django.db import transaction


class ReportDashboardView(View):
    def get(self, request):
        clients = Load.objects.all()
        # clients = Client.objects.all()

        context = {
            'clients': clients,
            'section': 'report'
        }
        return render(request, 'report/index.html', context)

    @transaction.atomic
    def post(self, request):
        # Client data
        client = Client.objects.create(
            load_no=request.POST['load_no'],
            buycem_invoice_no=request.POST['buycem_invoice_no'],
            delivery_address=request.POST['delivery_address'],
            type=request.POST['type']
        )

        # Delivery data
        delivery = Delivery.objects.create(
            client=client,
            deliv_date=request.POST['delivery_date'],
            distance_miles=float(request.POST['distance_miles']),
            delivery_cost=float(request.POST['delivery_cost']),
            delivery_per_mile=float(request.POST['delivery_cost']) / float(request.POST['distance_miles']),
            delivery_per_ton=float(request.POST['delivery_cost']) / float(request.POST['quantity_us_ton']),
            truck_agent=request.POST['truck_agent']
        )

        # Sale data
        sale = Sale.objects.create(
            delivery=delivery,
            quantity_us_ton=float(request.POST['quantity_us_ton']),
            price_per_ton=float(request.POST['price_per_ton']),
            invoice_amount=float(request.POST['quantity_us_ton']) * float(request.POST['price_per_ton'])
        )

        # SESCO data
        SESCO.objects.create(
            sale=sale,
            invoice=float(request.POST['sesco_invoice'])
        )

        # Commission data
        Commission.objects.create(
            sale=sale,
            agent=request.POST['commission_agent'],
            amount=float(request.POST['commission_amount'])
        )

        # Gross Profit data
        total_revenue = sale.invoice_amount
        total_cost = delivery.delivery_cost + float(request.POST['sesco_invoice']) + float(
            request.POST['commission_amount'])
        total_profit = total_revenue - total_cost

        GrossProfit.objects.create(
            sale=sale,
            profit_per_ton=total_profit / sale.quantity_us_ton,
            profit_per_truck=total_profit
        )

        return redirect('report:add_record')
