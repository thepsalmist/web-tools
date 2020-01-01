Coding Conventions
==================

Toolchain
---------
You can pick what works for you:

 * [Sublime Text](http://www.sublimetext.com) for javascript editing.
  * use [package control to add ESLint to sublime](https://packagecontrol.io/packages/ESLint)
 * [Atom](https://atom.io) for javacsript editing
  * use the [linter-eslint package for ESLint support](https://atom.io/packages/linter-eslint)
 * Use [PyCharm](https://www.jetbrains.com/pycharm/) for server Python work.

Notes
-----

 * Put a css class name on everything.  Don't use inline React styles.
 * Having one state management approach makes life easier, so by default toss everything
   in the Redux store.  One notable exception is things like temporary UI state (ie. if a drop
   down is open or closed).  Put those in React state on the container.
 * Separate stateful and display components.  React components that are connect to the Redux store
   should be called "Containers" (ie. `ImportantDataViewContainer`), whereas the display components they
   contain should not (ie. `ImportantDataView`).
 * Most data coming back from the API via the server uses underscore naming.  Leave them that way.  If you add
   things or are sending things generated in Javascript to the server, then default to using camelCase and change
   it on the server when assigning a new variable in python (ie. `important_note = request['importantNote']`).
 * Put as much data-cleaing / prep logic into the reducer as possible.  For instance, date parsing from a string
   to a Javascript `Date` objects should happen in a reducer.  So if the `publish_date` you get back from the server
   is a string, in the reducer turn in into a `Date` object and save it on the same reducer as `publishDate`
   (note the change in naming convention to indicate that it was added in JS code).
 * Sketch out a solution to an issue on GitHub **before** starting to implement it.  Use a checklist to describe
   all the Components, server endpoints, and actions you'll need.
