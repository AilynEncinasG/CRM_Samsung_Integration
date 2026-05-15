# web_samsung/views.py
# Este archivo ahora solo redirige a los módulos organizados
from .auth.login_views import login_view
from .inventario.producto_views import get_samsung_products
from .ventas.ventas_views import get_dw_sales_summary
from .core.system_views import estado_sistema