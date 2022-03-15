---
layout: post-layout.njk
title: Activity Logger App
date: 2022-03-14
tags: ["React", "NextJS", "project", "Prisma"]
excerpt: An app to help you track your time and stay in control.
---

There are time tracking apps like Rescue Timer. However the problem with those kinds of apps is that they run in the background. So in the present moment you’d never know that you are wasting your time. It is only when you are reviewing your day that you realize you have wasted your time.
This is where the idea for an activity logger app was born.
The basic concept is that the app displays a table where each row signifies an hour. After each hour, you’d want to come back to the application and enter the activity you were doing.

## Tech Stack

- NextJS for frontend and backend
- Typescript
- TailwindCSS
- Prisma as ORM
- PostgreSQL
- useSWR

**Here are 6 interesting bits of code I’d like to highlight.**

## Data Fetching

I created custom hooks with useSWR for data fetching. This way I don’t have to rely on any global state or revalidating data etc.
For example, here’s useProfile hook for getting user profiles.

```tsx
export const useProfile = () => {
  const { data, error } = useSWR('/profile', fetcher);

  return {
    profile: data as Profile,
    isLoading: !error && !data,
    isError: error,
  };
};
```

## Protecting Routes

For route protection, I used two strategies.
First, I had a validateRoute higher order function. This route would be called by any protected api route like /api/profile. It would check if there is a cookie and verify its json web token.

```ts
export const validateRoute = (
  handler: (req: NextApiRequest, res: NextApiResponse, user: User) => void
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const { ACTIVITY_LOGGER_TOKEN: token } = req.cookies;

    if (token) {
      let user; // user is declared. So it remains in the scope of this if.

      try {
        const { id } = jwt.verify(
          token,
          process.env.PRIVATE_KEY || 'string'
        ) as JwtPayload;

        user = await prisma.user.findUnique({
          where: { id },
        });
        if (!user) {
          res.status(401);
          res.json({ error: 'User not found' });
          return;
        }
      } catch (e) {
        res.status(401);
        res.json({ error: 'Not authorized' });
        return;
      }

      return handler(req, res, user);
    }
    res.status(401);
    res.json({ error: 'Not authorized' });
    return;
  };
};
```

Secondly, I also created a _middleware.ts file which would run by NextJS before hitting any page. This function would simply check for a cookie if the user is present on any protected page.

```ts
const protectedPages = ['/', '/preferences', '/activities'];

export default function middleware(req: NextRequest) {
  if (protectedPages.find((p) => p === req.nextUrl.pathname)) {
    const token = req.cookies.ACTIVITY_LOGGER_TOKEN;

    if (!token) {
      return NextResponse.redirect('/signin');
    }
  }
}
```

## Adding blocks

Every new day, when a user visits the dashboard, useSWR will hit the /api/logs route. This route would then check for today’s blocks. However, since it’s a new day, there are no blocks.

The solution I found was to create new blocks when hitting this route. This route would then create blocks if there are no blocks stored.

```ts
  // Then, add logs for today based on blocksPerHour.
  const blocksWithUserId = newBlocks(blocksPerHour).map((block) => ({
    ...block,
    userId: user.id,
  }));
  const createMany = await prisma.log.createMany({
    data: blocksWithUserId,
  });
  const newLogs = await prisma.log.findMany({ where: { date: date } });
  return res.status(200).json(newLogs);
```

## Time Zone Problem

Let’s say the time right now is 2:30 PM. Ideally, a user would want to edit activities for all the blocks whose end time is before 2:30.
But this was happening.
I was using a method called `showBlock` whose job it was to show the current block if end time is before current time, or else show nothing. This is the code for the showBlock method.

```ts
export const showBlock = (to: Date): boolean => {
  const currentTime = new Date(Date.now());
  return new Date(to) <= currentTime;
};
```

Did you spot the problem?
Well turns out, when we were seeding blocks for the new day to the database, the backend was storing time in the zero zone. However this was a problem because the currentTime variable in showBlock would capture time in the local zone of the user.
Solving this problem was quite easy.

```ts
export const showBlock = (to: Date): boolean => {
  const currentTime = new Date(Date.now());
  // Why?
  // B/c server stores time in zero zone, but client has current time in local zone. So we need to remove 'Z' from the end of the string.
  const removeTimeZoneSignifier = to
    .toString()
    .substring(0, to.toString().length - 1);
  return new Date(removeTimeZoneSignifier) <= currentTime;
};
```

Spotting this problem, however, was the key. I literally spent hours trying to debug this problem.

## Code Organization

I made a conscious effort to organize my code in a clean manner. So all the code related to Flash Message is inside the FlashMessage directory. All the code related to modal is inside the modal directory and so on.

```shell
├── README.md
├── components
│   ├── Activity.tsx
│   ├── AuthForm.tsx
│   ├── FlashMessage
│   │   ├── FlashMessage.tsx
│   │   ├── FlashMessageState.tsx
│   │   ├── FlashMessageWrapper.tsx
│   │   └── index.ts
│   ├── dashboard
│   │   ├── Block.tsx
│   │   ├── Blocks.tsx
│   │   ├── index.ts
│   │   └── showBlock.ts
│   ├── modal
│   │   ├── AddActivity.tsx
│   │   ├── EditBlock.tsx
│   │   ├── Modal.tsx
│   │   ├── ModalState.tsx
│   │   └── index.ts
│   └── ui
│       ├── AppLayout.tsx
│       ├── CenteredLayout.tsx
│       ├── SlideOver.tsx
│       ├── classes.ts
│       └── index.ts
├── next-env.d.ts
├── next.config.js
├── package.json
├── pages
│   ├── _app.tsx
│   ├── _middleware.ts
│   ├── activities.tsx
│   ├── api
│   │   ├── activities
│   │   │   ├── add.ts
│   │   │   ├── delete.ts
│   │   │   ├── index.ts
│   │   │   └── update.ts
│   │   ├── logout.ts
│   │   ├── logs
│   │   │   ├── index.ts
│   │   │   └── update.ts
│   │   ├── profile
│   │   │   ├── index.ts
│   │   │   └── update.ts
│   │   ├── signin.ts
│   │   ├── signup.ts
│   │   └── user.ts
│   ├── index.tsx
│   ├── preferences.tsx
│   ├── signin.tsx
│   └── signup.tsx
├── postcss.config.js
├── prisma
│   ├── migrations
│   ├── schema.prisma
│   └── seed.ts
├── public
│   ├── favicon.ico
│   └── vercel.svg
├── styles
│   ├── Home.module.css
│   ├── globals.css
│   └── nprogress.css
├── tailwind.config.js
├── tsconfig.json
├── types.ts
├── utils
│   ├── activitiesData.ts
│   ├── activityTypes.ts
│   ├── addActivity.ts
│   ├── auth.ts
│   ├── classNames.ts
│   ├── convertNumberToHour.ts
│   ├── fetcher.ts
│   ├── getDateString.ts
│   ├── hooks.ts
│   ├── index.ts
│   ├── newBlocks.ts
│   ├── prisma.ts
│   ├── updateBlock.ts
│   ├── useActivities.ts
│   ├── useBlocks.ts
│   ├── useProfile.ts
│   └── validateRoute.ts
└── yarn.lock
```

Apart from that I also used comments liberally in my code.

## Async Operation Problem

Async operations in the application were taking too long. For example, when I edited the activity for a block, my app would send a post request to the api and then useSWR would re fetch the data.
All this while, my app was still not reflecting the new changes.
The solution I implemented was using the mutate method of useSWR. Using mutate, I am simply applying changes to the local state while the app is doing its async operations. Then finally once data comes back it would show the new data.

```ts
  /**
   * It updates 'blockState' when a new activity is selected.
   */
  const update = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!modal.currentBlockId) return;

    // 1. Immediately Update local state
    if (modal.activity) {
      updateLocalBlock(modal.activity.id, modal.notes);
    }
    // 2. Hide the modal
    if (setModal) setModal({ ...modal, showModal: false });

    try {
      // 2. Try updating the block
      if (modal.activity) {
        await updateBlock(modal.currentBlockId, modal.activity.id, modal.notes);
        // 3. If successful, revalidate blocks data
        mutate('/logs');
      }
    } catch (e) {
      // 1. Show warning flash message
      setFlashMessages &&
        setFlashMessages((prevMessages) => [
          ...prevMessages,
          {
            title: 'Error updating block',
            message:
              'Something went wrong. There was an network error while updating the block. Please try again.',
            type: 'warning',
          },
        ]);
      //2. Reset the local state
      updateLocalBlock(null, '');
    }
  };

  /**
   * This function updates the local state with the `activityId`
   */
  const updateLocalBlock = (activityId: number | null, notes: string = '') => {
    const newBlocks = blocks.map((block) => {
      if (block.id === modal.currentBlockId) {
        return {
          ...block,
          activityId,
          notes,
        };
      } else {
        return block;
      }
    });
    mutate('/logs', newBlocks, false);
  };
```

[View live](https://activity-logger.vercel.app/)
[View on Github](https://github.com/madebyaman/activity-logger)
