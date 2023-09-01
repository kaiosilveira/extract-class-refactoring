[![Continuous Integration](https://github.com/kaiosilveira/extract-class-refactoring/actions/workflows/ci.yml/badge.svg)](https://github.com/kaiosilveira/extract-class-refactoring/actions/workflows/ci.yml)

ℹ️ _This repository is part of my Refactoring catalog based on Fowler's book with the same title. Please see [kaiosilveira/refactoring](https://github.com/kaiosilveira/refactoring) for more details._

---

# Extract class

<table>
<thead>
<th>Before</th>
<th>After</th>
</thead>
<tbody>
<tr>
<td>

```javascript
class Person {
  get officeAreaCode() {
    return this._officeAreaCode;
  }

  get officeNumber() {
    return this._officeNumber;
  }
}
```

</td>

<td>

```javascript
class Person {
  get officeAreaCode() {
    return this._telephoneNumber.areaCode;
  }

  get officeNumber() {
    return this._telephoneNumber.number;
  }
}

class TelephoneNumber {
  get areaCode() {
    return this._areaCode;
  }

  get number() {
    return this._number;
  }
}
```

</td>
</tr>
</tbody>
</table>

**Inverse of: [Inline Class](https://github.com/kaiosilveira/inline-class-refactoring)**

Classes inevitably grow, and as they grow, their "single responsibilities" get larger and larger, blurring the idea of "single" as well as the idea of "responsibility". Often enough, we find ourselves looking to a class that has clusters of functionality that speak to separate concerns. In these cases, it's better to extract these concerns into separate classes. The result? Each one of them will be smaller, more focused and less susceptible to bloating.

## Working example

In our working example, we start with a `Person` class. This class holds some information about a telephone number. As we well know, phone numbers, in general, are not that simple to handle: we have different area codes, numbers, formats, and other particularities that make it hard to manage if poorly handled. The idea, then, is to extract the telephone number specificities to a separate, specialized `TelephoneNumber` class, so we can isolate this concern out of `Person`.

### Test suite

Our initial test suite covers the telephone number assignment and subsequent readings, it will help us in making sure that the behavior of these accessors remains unchanged throughout the refactoring.

```javascript
describe('Person', () => {
  it('should correctly store a telephone number', () => {
    const person = new Person();

    person.officeAreaCode = '123';
    person.officeNumber = '4567890';

    expect(person.telephoneNumber).toEqual('(123) 4567890');
  });
});
```

### Steps

We start by introducing the `TelephoneNumber` class, which is empty, for now:

```diff
diff --git a/src/telephone-number/index.js b/src/telephone-number/index.js
@@ -0,0 +1 @@
+export class TelephoneNumber {}
```

Then, we move forward and initialize an instance of `TelephoneNumber` at `Person`. This instance will be used soon:

```diff
diff --git a/src/person/index.js b/src/person/index.js
@@ -1,4 +1,10 @@
+import { TelephoneNumber } from '../telephone-number';
+
 export class Person {
+  constructor() {
+    this._telephoneNumber = new TelephoneNumber();
+  }
+
   get name() {
     return this._name;
   }
```

Now, we can start moving some accessors to `TelephoneNumber`. First, we move `officeAreaCode`:

```diff
diff --git a/src/person/index.js b/src/person/index.js
@@ -18,11 +18,11 @@ export class Person {
   }

   get officeAreaCode() {
-    return this._officeAreaCode;
+    return this._telephoneNumber.officeAreaCode;
   }

   set officeAreaCode(arg) {
-    this._officeAreaCode = arg;
+    this._telephoneNumber.officeAreaCode = arg;
   }

   get officeNumber() {

diff --git a/src/telephone-number/index.js b/src/telephone-number/index.js
@@ -1 +1,9 @@
-export class TelephoneNumber {}
+export class TelephoneNumber {
+  get officeAreaCode() {
+    return this._officeAreaCode;
+  }
+
+  set officeAreaCode(arg) {
+    this._officeAreaCode = arg;
+  }
+}
```

And then we move `officeNumber`:

```diff
diff --git a/src/person/index.js b/src/person/index.js
@@ -26,10 +26,10 @@ export class Person {
   }

   get officeNumber() {
-    return this._officeNumber;
+    return this._telephoneNumber._officeNumber;
   }

   set officeNumber(arg) {
-    this._officeNumber = arg;
+    this._telephoneNumber._officeNumber = arg;
   }
 }

diff --git a/src/telephone-number/index.js b/src/telephone-number/index.js
@@ -6,4 +6,12 @@ export class TelephoneNumber {
   set officeAreaCode(arg) {
     this._officeAreaCode = arg;
   }
+
+  get officeNumber() {
+    return this._officeNumber;
+  }
+
+  set officeNumber(arg) {
+    this._officeNumber = arg;
+  }
 }
```

Finally, we move the `telephoneNumber` getter:

```diff
diff --git a/src/person/index.js b/src/person/index.js
@@ -14,7 +14,7 @@ export class Person {
   }

   get telephoneNumber() {
-    return `(${this.officeAreaCode}) ${this.officeNumber}`;
+    return this._telephoneNumber.telephoneNumber;
   }

   get officeAreaCode() {

diff --git a/src/telephone-number/index.js b/src/telephone-number/index.js
@@ -1,4 +1,8 @@
 export class TelephoneNumber {
+  get telephoneNumber() {
+    return `(${this.officeAreaCode}) ${this.officeNumber}`;
+  }
+
   get officeAreaCode() {
     return this._officeAreaCode;
   }
```

Now, although functional, the code reads somewhat redundant. We can, of course, rename some fields to make the class clear. We start by renaming `officeAreaCode` to `areaCode`:

```diff
diff --git a/src/person/index.js b/src/person/index.js
@@ -18,11 +18,11 @@ export class Person {
   }

   get officeAreaCode() {
-    return this._telephoneNumber.officeAreaCode;
+    return this._telephoneNumber.areaCode;
   }

   set officeAreaCode(arg) {
-    this._telephoneNumber.officeAreaCode = arg;
+    this._telephoneNumber.areaCode = arg;
   }

   get officeNumber() {

diff --git a/src/telephone-number/index.js b/src/telephone-number/index.js
@@ -1,14 +1,14 @@
 export class TelephoneNumber {
   get telephoneNumber() {
-    return `(${this.officeAreaCode}) ${this.officeNumber}`;
+    return `(${this.areaCode}) ${this.officeNumber}`;
   }

-  get officeAreaCode() {
-    return this._officeAreaCode;
+  get areaCode() {
+    return this._areaCode;
   }

-  set officeAreaCode(arg) {
-    this._officeAreaCode = arg;
+  set areaCode(arg) {
+    this._areaCode = arg;
   }

   get officeNumber() {
```

And then we rename `officeNumber` to simply `number`:

```diff
diff --git a/src/person/index.js b/src/person/index.js
@@ -26,10 +26,10 @@ export class Person {
   }

   get officeNumber() {
-    return this._telephoneNumber._officeNumber;
+    return this._telephoneNumber._number;
   }

   set officeNumber(arg) {
-    this._telephoneNumber._officeNumber = arg;
+    this._telephoneNumber._number = arg;
   }
 }

diff --git a/src/telephone-number/index.js b/src/telephone-number/index.js
@@ -1,6 +1,6 @@
 export class TelephoneNumber {
   get telephoneNumber() {
-    return `(${this.areaCode}) ${this.officeNumber}`;
+    return `(${this.areaCode}) ${this.number}`;
   }

   get areaCode() {
@@ -11,11 +11,11 @@ export class TelephoneNumber {
     this._areaCode = arg;
   }

-  get officeNumber() {
-    return this._officeNumber;
+  get number() {
+    return this._number;
   }

-  set officeNumber(arg) {
-    this._officeNumber = arg;
+  set number(arg) {
+    this._number = arg;
   }
 }
```

Finally, we replace the `telephoneNumber` getter by a `toString` function. This way, callers can intuitively call `.toString()` in `TelephoneNumber` instances to get its text representation:

```diff
diff --git a/src/person/index.js b/src/person/index.js
@@ -14,7 +14,7 @@ export class Person {
   }

   get telephoneNumber() {
-    return this._telephoneNumber.telephoneNumber;
+    return this._telephoneNumber.toString();
   }

   get officeAreaCode() {

diff --git a/src/telephone-number/index.js b/src/telephone-number/index.js
@@ -1,5 +1,5 @@
 export class TelephoneNumber {
-  get telephoneNumber() {
+  toString() {
     return `(${this.areaCode}) ${this.number}`;
   }
```

And that's it!

As you might have noticed, we still kept the getters and setters related to the telephone number in the `Person` class, creating some indirection. This can be seen as a design decision, as well as an example of technical debt to be paid off in the future. Changing the approach to how we set the phone number of a person will largely depend on how many clients are using these accessors to perform operations and how healthy and test-covered the codebase is.

### Commit history

Below there's the commit history for the steps detailed above.

| Commit SHA                                                                                                           | Message                                                                |
| -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [bc2495d](https://github.com/kaiosilveira/extract-class-refactoring/commit/bc2495dc50e1ce1a1eae4867ddf381d576e1714f) | introduce `TelephoneNumber` class                                      |
| [077b619](https://github.com/kaiosilveira/extract-class-refactoring/commit/077b61944aee50563d8716d2d941812da3f1812d) | create an instance of `TelephoneNumber` at `Person`                    |
| [a0cd9a3](https://github.com/kaiosilveira/extract-class-refactoring/commit/a0cd9a398d087680fb36e2add77aa463791b6dd0) | move `officeAreaCode` field to `TelephoneNumber`                       |
| [2fd5cc2](https://github.com/kaiosilveira/extract-class-refactoring/commit/2fd5cc2f97a7ae3f0f816b6da1a425af4b944f74) | move `officeNumber` field to `TelephoneNumber`                         |
| [cb8e3d2](https://github.com/kaiosilveira/extract-class-refactoring/commit/cb8e3d226c62a47c4f335bf0de8ada4f89a15781) | move `telephoneNumber` field to `TelephoneNumber`                      |
| [584cbc3](https://github.com/kaiosilveira/extract-class-refactoring/commit/584cbc3d54b8e620b2cd378a29216267f26e3ce5) | rename `officeAreaCode` to `areaCode` at `TelephoneNumber`             |
| [172ccaf](https://github.com/kaiosilveira/extract-class-refactoring/commit/172ccafcdc8577f531a48b99117aa2b7e3d1c2b1) | rename `officeNumber` to `number` at `TelephoneNumber`                 |
| [a59e027](https://github.com/kaiosilveira/extract-class-refactoring/commit/a59e027586ce31017c5fc497cd24ce15c5659246) | replace `telephoneNumber` getter to `toString` fn at `TelephoneNumber` |
| [e6129a1](https://github.com/kaiosilveira/extract-class-refactoring/commit/e6129a10d6ad397141d0df73351036f4fee484be) | update docs                                                            |

For the full commit history for this project, check the [Commit History tab](https://github.com/kaiosilveira/extract-class-refactoring/commits/main).
