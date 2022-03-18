---
layout: post-layout.njk
title:  Bummaries App
date: 2022-03-12
tags: ["React", "NextJS", "project", "Typescript"]
excerpt: An app to help you write, publish, and share your book notes.
---

I love reading books and taking notes. But it is hard if you want to share those notes with other people. People like Derek Sivers, Nat Eliason, use their blog to share their book notes. A blog is not an ideal place to share your book notes.

Hence the idea of Bummaries. The app allows people to write their book notes or summaries and share it with other people.

[Check out the loom video to see a quick overview of my app](https://www.loom.com/share/efded017554a4782b07040aa4e5ef925?sharedAppSource=personal_library)

[View live](https://bummaries.app/)

[View on Github](https://github.com/madebyaman/book-notes)

## The Tech Stack

For building the app, I went with the following tech stack:

- For state management: Context API and Easy Peasy
- Firebase for database and authentication
- Cloudinary for image handling
- Chakra UI for styles
- Tiptap Editor for rich text editing
- NextJS
- Typescript
- React Select for handling book selection

I don't want to bore you with all the details of the project. To keep it short, I've identified 6 unique problems that I solved in the project.

## 6 Unique Problems I Solved

### Error Handling

In my opinion, error handling is super important. That is why I deployed several strategies for handling errors.
Firstly, I used React Error Boundary to wrap the entire application and some vulnerable parts.

```jsx
<ErrorBoundary FallbackComponent={ErrorFallback}>
  ...
</ErrorBoundary>
```

Secondly, I used local state to handle errors in pages like Signin, Sign up. etc

```jsx
  const [error, setError] = useState()
  setError(message);
```

I also used custom error classes to handle errors thrown while doing async operations.

```jsx
export class SlugError extends Error {}
throw new SlugError('Provided slug exists');
```

Finally, for handling server side errors, I would return null from the getServerSideProps method and handle it in the component.

### Data Fetching

In the app, I employed many strategies for data fetching.
First off, I used the good old useEffect for getting data.

```jsx
  useEffect(() => {
    const getNotes = async () => {
      try {
        const unsub = await subscribeToCurrentUserNotes((result) => {
          dispatch({ type: 'LOADING' });
          setCards(result);
          dispatch({ type: 'LOADED' });
        });
        return unsub;
      } catch (e) {
        throw e;
      }
    };
    getNotes();
  }, [dispatch]);
```

For data that is needed by many parts of the application, I used easy-peasy thunks and called them from `useEffect`.

```jsx
    /**
     * Gets a book with the given bookId. And updates `selectedBook` state.
     */
    fetchBook: thunk(async (actions, payload) => {
      const book = await getBook(payload.bookId);
      if (book && payload.isSubscribed) {
        actions.updateSelectedBook(book);
      }
    }),
```

Finally, I also used `getServerSideProps` method from NextJS.

```jsx
export async function getServerSideProps(context: {
  params: { username: string };
}) {
  const { username } = context.params;
  if (!username) return;
  const profile = await getUserProfileFromUsername(username);
  const userNotes = profile && (await getUserNotes({ userId: profile.id }));
  return {
    props: {
      notes: JSON.parse(JSON.stringify(userNotes)),
      profile: JSON.parse(JSON.stringify(profile)),
    },
  };
}
```

### Handling book cover uploading

Since this is an app that allows people to take book notes, I wanted people to be able to select the book. For this, I relied on the Open Library API.
Open Library API, however, has one limitation. It's book cover endpoint only gives you 10 requests per hour.  This would be a problem for my app.
Hence I handle uploading book covers myself. Here's how I implemented this:

When someone selects a book, we add bookId to the current note.

```ts
  const handleSelectChange = (newVal: Book | null) => {
    if (newVal) {
      const value = { ...newVal, key: convertSlashToPlus(newVal.key) };
      setSelectedBook(value);
      updateBookId(value.key);
      return;
    }
    setSelectedBook(newVal);
  };
```

And on saving the note, first we check if a book with bookId exists in the db. If not, we first upload the book cover to cloudinary and then add the url to the book.

```ts
        // First upload the book cover if selectedBook.cover exists
        const coverURL = await uploadBookCover(selectedBook.cover);
        const newBook = {
          ...selectedBook,
          photoURL: coverURL || undefined,
        };

        // The, get the URL of the uploaded image and set it to selectedBook.photoURL
        try {
          addBook(newBook);
        } catch (e) {
          showFlashMessage({
            success: false,
            message: 'Error saving the selected book',
          });
        }
```

### Custom Hooks

I used several custom hooks throughout the app. Like useAuth for authenticating the user.

```js
export const useAuth = () => {
  const [authInfo, setAuthInfo] = useState<{
    user: null | { id: string; emailVerified: boolean };
    isLoading: boolean;
  }>({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    const callback = (user: { id: string; emailVerified: boolean } | null) =>
      setAuthInfo({ user, isLoading: false });
    const unsub = addAuthListener(callback);

    return unsub;
  }, []);

  return authInfo;
};
```

There's useInput hook, which returns value, onChange method, and reset value method.

```js
export const useInput = (
  initialValue: string
): [
  { value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void },
  () => void
] => {
  const [value, setValue] = useState(initialValue);

  return [
    {
      value,
      onChange: (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
    },
    () => setValue(initialValue),
  ];
};
```

### Avoiding Vendor Lock-ins

I made a conscious effort to not integrate Firebase deeply with our code. This way, in future, I could use any other service like AWS with ease.
To do this, I kept firebase specific code in a separate file rather than adding it directly in our code.
For example, this subscribeToCurrentUserNotes method. This method is required by the BookNotes.tsx file to display book notes of the logged in user in the dashboard.

```js
export const subscribeToCurrentUserNotes = async (
  cb: (notes: DashboardNote[]) => void
) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return cb([]);
  return subscribeToNotes(currentUser.id, cb);
};
```

Similarly all other methods like sign in, signup, signout, getBook, getNote, etc, are kept separate in their own files.

### Handling input validation

Two things that require input validation with the database are: slug for the book note, and username.

For handling the validation for these 2 inputs, I created methods like checkUsernameExists and checkSlugExists.

```js
/**
 * Method of check whether a given username exists
 * @param userId if userId is given, it means user is already signed up. Now we need to additionally check the current user's username.
 * @returns true if username exists. False otherwise.
 */
export const checkUsernameExist = async (username: string, userId?: string) => {
  const usersCollectionRef = collection(db, 'users');
  const q = query(usersCollectionRef, where('username', '==', username));

  try {
    const usersSnap = await getDocs(q);
    if (usersSnap.empty) {
      return false;
    } else if (userId) {
      // 1. Get the current username
      const userRef = doc(
        db,
        'users',
        userId
      ) as DocumentReference<UserProfile>;
      const currentUserSnap = await getDoc(userRef);
      if (!currentUserSnap.exists()) return false;
      if (currentUserSnap.data().username === username) {
        return false;
      }
    } else {
      return true;
    }
  } catch (e) {
    console.error(e);
    return true;
  }
};
```
