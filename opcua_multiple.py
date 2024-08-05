import random

from opcua import Server, ua
server_lis = ["4840","4841"]
ip = "10.141.45.247"



for item in server_lis:
    globals()['server'+item] = Server()
    globals()['server'+item].set_endpoint(f'opc.tcp://{ip}:{item}')
    uri = "iotdata"
    idx = globals()['server'+item].register_namespace(uri)
    objects = globals()['server'+item].get_objects_node()
    myobj = objects.add_object(ua.NodeId("IOTBLOCK", idx), "IOTBLOCK")
    tag_list = {
        "ok_parts":random.randint(1,200),
        "nok_parts":random.randint(1,100),
        "cycletime":0.00,
        "emp_name":"0",
        "emp_code":"0",
        "model":0,
        "sr_no":"0000000",
        "shift":0}
    for i,j in tag_list.items():
        myvar = myobj.add_variable(ua.NodeId(i, idx), i, j)
        myvar.set_writable()
    globals()['server'+item].start()
    print(f'opc.tcp://{ip}:{item}' ,"started")
