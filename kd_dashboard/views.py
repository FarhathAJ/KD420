import os
from django.shortcuts import render
from opcua import Client
import json
from kd_dashboard import opcua_data_collector as odc
import threading
# Create your views here.
from django.http import JsonResponse

print(os.getcwd())


def create_objects():
    try:
        CONFIG_DATA = json.loads(open('config.json').read())
        print("Last Program validated on on 29-07-2024")
        for server in CONFIG_DATA:
            globals()[server] = odc.opcua_monitor(CONFIG_DATA[server], server)
            threading.Thread(target=globals()[server].connect_server).start()
    except Exception as e:
        print(e)


create_objects()


def get_station_data(station_name):
    print(f" page request for {station_name}")
    return_data = globals()[station_name].all_tags
    return_data['tack_time'] = 'xxxx'
    # print("2222222", return_data)
    return return_data

def ajax_call(request,station_name):
    return_data = globals()[station_name].all_tags
    return_data['tack_time'] = 'xxxx'
    # print("1111111",return_data)
    return JsonResponse( return_data , safe=False )




def main_page(request, station_name):
    context = get_station_data(station_name)
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[-1].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    print(",,,,,,,,,", ip)
    return render(request, 'index.html')
    # return JsonResponse({"hello": station_name}, safe=False)
