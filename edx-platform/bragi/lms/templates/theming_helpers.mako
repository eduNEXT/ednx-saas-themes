## mako

<%!
import operator

from functools import reduce  # forward compatibility for Python 3
from mako.template import Template
from django.contrib.staticfiles.storage import staticfiles_storage

from microsite_configuration.models import MicrositeTemplate
from openedx.core.djangoapps.site_configuration import helpers as configuration_helpers
try:
    from lms.djangoapps.branding_by_referer import get_options_with_overrides_for_current_user
except ImportError:
    pass
%>

<%def name="db_include_mako(file, **kwargs)"><%
try:
    source = MicrositeTemplate.objects.get(template_uri=file)
    tmpl = Template(source.template)
except:
    tmpl = Template("<!-- error trying to render:{} -->".format(file))
finally:
    tmpl.render_context(context)

kwargs.get("default", "")
%></%def>

<%def name="db_render_str_mako(file, **kwargs)"><%
try:
    source = MicrositeTemplate.objects.get(template_uri=file)
    tmpl = Template(source.template)
    return tmpl.render()
except:
    tmpl = Template("<!-- error trying to render:{} -->".format(file))
    tmpl.render_context()

kwargs.get("default", "")
%></%def>

<%def name="options(*args, **kwargs)"><%
options_dict = configuration_helpers.get_value("THEME_OPTIONS", {})
try:
    options_dict = get_options_with_overrides_for_current_user()
except NameError:
    pass

if args:
    try:
        value = reduce(operator.getitem, args, options_dict)
    except AttributeError:
        pass
    except KeyError:
        value = kwargs.get("default", "")
    finally:
        try:
            if value.endswith(".html"):
                value = db_render_str_mako(value, default=value)
            elif staticfiles_storage.exists(value):
                value = staticfiles_storage.url(value)
            value = value.decode("utf-8")
        except AttributeError:
            pass
        except:
            tmpl = Template("<!-- error trying to read:{} -->".format(args))
            tmpl.render_context(context)
return value
%></%def>

<%def name="https_url(url)"><%
try:
    if url.startswith("http://"):
        return "https://" + url[7:]
except AttributeError:
    return url
%></%def>
