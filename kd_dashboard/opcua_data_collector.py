import threading
import time
from opcua import Client
import csv, json, os
from datetime import datetime
import shutil, sys


def get_run_time(func):
    def wrapper(*args):
        start_time = datetime.now()
        func(*args)
        time_taken = datetime.now() - start_time
        print(f"Time taken for {func} is {time_taken}")
    return wrapper


class opcua_monitor:
    def __init__(self, DATA, server):
        self.tag_not_found_list = None
        self.endpoint_con_status = None
        sys.excepthook = self.default_exception_handler
        self.station = server
        self.server_config = DATA['server_config']
        self.tags = DATA['tags']
        self.client = None
        self.connection_retry_time = 5
        self.all_tags = {}
        self.create_tags()
        # self.connect_server()

    def default_exception_handler(self, exc_type, exc_value, exc_traceback):
        print(f"Default exception Handler")
        print(f' Exc type : {exc_type}')
        print(f' Exc Value :{exc_value}')

        for i in range(10):
            print(f'This window for {self.server_config['end_point']} close in {10 - i} sec')
            time.sleep(1)

    def create_tags(self):
        for tag in self.tags:
            globals()[tag] = None

    def connect_server(self):
        try:
            self.client = Client(self.server_config['end_point'])
            self.client.connect()
            self.endpoint_con_status = True
            print(
                f' ::: server initializing for end point {self.station}  is successful ::: - {datetime.now()}')
        except:
            print(
                f' ::: server initializing for end point {self.station}  is unsuccessful will be retry in 5 Sec ::: - {datetime.now()}')
        self.live_logger()
        print("Thread Started")

    def live_logger(self):
        while True:
            if self.endpoint_con_status:
                try:  # check for opcua connected
                    b = self.client.get_endpoints()
                    for tag_name, tag in self.tags.items():
                        # print(tag)
                        try:
                            node = self.client.get_node(tag)
                            self.all_tags[tag_name] = node.get_value()
                        except Exception as e:
                            self.all_tags[tag_name] = 'XXXX'
                            print(e)
                except Exception as e:
                    print(e)
                    self.endpoint_con_status = False
            else:
                time.sleep(self.connection_retry_time)
                self.connect_server()

    def get_shift(self):
        c_time = datetime.now()
        s1_start_time = datetime.strptime(str(datetime.now()).split(' ')[0] + ' 8:15:00.000', '%Y-%m-%d %H:%M:%S.%f')
        s2_start_time = datetime.strptime(str(datetime.now()).split(' ')[0] + ' 16:15:00.000', '%Y-%m-%d %H:%M:%S.%f')
        s3_start_time = datetime.strptime(str(datetime.now()).split(' ')[0] + ' 00:15:00.000', '%Y-%m-%d %H:%M:%S.%f')
        if s1_start_time <= c_time <= s2_start_time:
            return 'S1'
        elif s3_start_time <= c_time <= s1_start_time:
            return 'S3'
        else:
            return 'S2'
if __name__ == '__main__':
    try:
        CONFIG_DATA = json.loads(open('../config.json').read())
        print("Last Program validated on on 29-07-2024")
        for server in CONFIG_DATA:
            globals()[server] = opcua_monitor(CONFIG_DATA[server], server)
            threading.Thread(target=globals()[server].connect_server).start()
        while True:
            time.sleep(5)
            print(globals()['Stn1'].all_tags)
    except Exception as e:
        print(e)
