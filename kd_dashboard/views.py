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
            print(server , "object created")
    except Exception as e:
        print(e)


create_objects()





def ajax_call(request, plc_name , station_name):
    all_plc_tags = globals()[plc_name].all_tags
    station_tags = {}
    for tag_name , value in all_plc_tags.items():
        if tag_name.find(station_name) != -1:
            station_tags[tag_name.split('|')[-1]] = value

    return JsonResponse(station_tags, safe=False)


def main_page(request,plc_name , station_name):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[-1].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    print(",,,,,,,,,", ip)
    context  = {
        'plc_name' : plc_name,
        'station_name':station_name
    }

    return render(request, 'index.html' , context)
    # return JsonResponse({"hello": station_name}, safe=False)
