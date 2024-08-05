import threading


# A class representing an object that we want to work with in threads
class MyObject:
    def __init__(self, value):
        self.value = value

    def update_value(self, new_value):
        self.value = new_value

    def get_value(self):
        return self.value


# A lock to ensure thread-safe access to shared resources
lock = threading.Lock()


# A function that threads will run
def thread_function(obj, new_value):
    with lock:
        print(f"Thread {threading.current_thread().name} is updating value")
        obj.update_value(new_value)
        print(f"Thread {threading.current_thread().name} updated value to {obj.get_value()}")


def main():
    # Create multiple objects
    objects = [MyObject(i) for i in range(5)]

    # Create and start threads
    threads = []
    for i, obj in enumerate(objects):
        thread = threading.Thread(target=thread_function, args=(obj, i * 10), name=f"Thread-{i}")
        threads.append(thread)
        thread.start()

    # Wait for all threads to finish
    for thread in threads:
        thread.join()

    # Print final values of all objects
    for i, obj in enumerate(objects):
        print(f"Object {i} final value: {obj.get_value()}")


if __name__ == "__main__":
    main()
