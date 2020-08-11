import unittest

from server.util.stringutil import snake_to_camel, camel_to_snake


class StringUtilTest(unittest.TestCase):

    def testSnakeToCamel(self):
        assert snake_to_camel("this_is_a_var") == "thisIsAVar"

    def testCamelToSnake(self):
        assert camel_to_snake("thisIsAVar") == "this_is_a_var"


if __name__ == "__main__":
    unittest.main()
