import unittest

from server.views.test import BaseAppTest


class HomepageTest(BaseAppTest):

    def test_home_age(self):
        response = self.app.get('/', follow_redirects=True)
        self.assertEqual(response.status_code, 200)


if __name__ == "__main__":
    unittest.main()
