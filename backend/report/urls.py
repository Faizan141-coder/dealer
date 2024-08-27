from django.urls import path

from report.views import ReportDashboardView

app_name = 'report'


urlpatterns = [
    path('', ReportDashboardView.as_view(), name='report_dashboard'),
    path('add', ReportDashboardView.as_view(), name='add_record'),
]