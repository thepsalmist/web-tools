import unittest
from server import app


class BaseAppTest(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        pass

    def tearDown(self):
        pass
