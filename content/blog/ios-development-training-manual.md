---
title: "Writing an iOS training manual: what teaching it taught me"
date: "2026-07-23"
summary: "A 10-module iOS curriculum built during a 504-hour internship — the structure, the misconceptions I had to correct, and why every UIKit example got a SwiftUI twin."
tags: iOS, Swift, UIKit, SwiftUI, Architecture, Teaching
pdf: "/documents/ios-development-training-manual.pdf"
---

During my internship at Seven Seven Global Services I was asked to produce an iOS
development training manual. What came out was version 2.0 of a document that does two
jobs at once: a shot-ready video script for the team producing the training series, and
a self-study workbook for developers reading it on their own.

It covers seven core topics across ten modules, from Swift fundamentals to app
architecture and device capabilities, and it is grounded throughout in **TicketPlease**
— a working UIKit ticket-booking app I built alongside it, in Swift 5 on iOS 17.5, with
**zero third-party dependencies**.

This post is about the decisions that shaped it, because those turned out to be more
interesting than the syllabus.

## The structure

The curriculum runs in the order a real app gets built, not the order a language
reference is organised:

1. **iOS Fundamentals and Swift Basics** — variables, optionals, error handling, structs vs classes, protocols, and the outlet/action mechanic that everything else hangs off
2. **UIKit, MVVM, Auto Layout and Table Views** — the view controller life cycle, constraints, navigation, tab bars, reusable cells
3. **Intermediate Swift and Concurrency** — closures, escaping vs non-escaping, `map`/`filter`/`reduce`, ARC, GCD and `async`/`await`
4. **Networking** — `URLSession`, status codes, `Codable` and `CodingKeys`, API client architecture, async image loading
5. **Data Persistence and Security** — `UserDefaults`, `FileManager`, Core Data, and the Keychain
6. **Architecture Patterns and Dependency Injection** — the problem MVC creates, Clean Architecture, protocol-based injection
7. **Maps, Location, Notifications, Media and Animation**
8. **Case study** — requirements, flowchart, wireframe, and the complete booking flow
9. **Testing** — unit tests as specifications, fakes, and testing things that are genuinely hard to test
10. **Documentation** — how to record a change so someone else can follow it

Then four appendices: a screenshot index, a glossary, an accuracy and currency register,
and a list of common Xcode errors with fixes.

## Every UIKit example has a SwiftUI twin

This was the single biggest structural decision, and it took the longest to justify.

The core curriculum is taught in **UIKit**, deliberately. UIKit is what the
overwhelming majority of existing production code is written in, and doing layout and
navigation by hand first is what makes SwiftUI's shortcuts legible rather than magical.
If you learn `NavigationStack` before you have ever pushed a view controller, you have
learned an incantation, not a concept.

But nobody writing a brand-new screen in 2026 reaches for UIKit first.

So rather than force the choice, every UIKit example is followed by the same idea
expressed in current SwiftUI, directly beneath it. Crucially, those blocks target
**iOS 17-and-later APIs** — the `@Observable` macro, `NavigationStack`, `async`/`await`
— not the older `ObservableObject` and `NavigationView` patterns that still dominate
search results and Stack Overflow answers.

That last point matters more than it sounds. A learner searching for SwiftUI examples in
2026 will land on material written for iOS 14. Showing the current API next to the UIKit
one inoculates them against that.

## The misconceptions were the most valuable part

Partway through, I started keeping a register of things that had been stated during
training sessions that were simply not true. Each one became a red box in the manual:
the myth, then the documented reality, with a source. Every one is collected in an
appendix so a reviewer can check any single claim without re-reading the chapter.

Three of them are worth repeating here.

### "UserDefaults is encrypted on iOS"

This is the one that matters most, and it is dangerous rather than merely wrong.

**The myth:** `UserDefaults` is a safe place to store a password or token, because on
iOS it is automatically encrypted — unlike Android, where you have to do it yourself.

**The reality:** `UserDefaults` is **not encrypted**. It writes to a plain, unencrypted
`.plist` file inside the app's container, with no access control. Anyone with filesystem
access, a jailbroken device, or an unencrypted device backup can read it in seconds.

Passwords, tokens, API keys and personal data belong in the **Keychain**, which is
encrypted and protected by the operating system. `UserDefaults` is for non-sensitive
preferences only.

```swift
// Wrong — readable in plain text from a backup
UserDefaults.standard.set(password, forKey: "userPassword")

// Right — encrypted and access-controlled by the OS
let query: [String: Any] = [
    kSecClass as String: kSecClassGenericPassword,
    kSecAttrAccount as String: account,
    kSecValueData as String: Data(password.utf8),
    kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly
]
SecItemAdd(query as CFDictionary, nil)
```

The accessibility attribute earns its own slide in the manual. `WhenUnlockedThisDeviceOnly`
keeps the value off iCloud backups entirely — which is usually what you want for a
credential.

### "`map` finds the thing you are looking for"

**The myth:** `map` was described as "finding the specific number you need", and
`filter` as the same thing but more specific.

**The reality:** `map` does not search — it **transforms**. It applies a closure to
every element and returns a new collection of the *same length*. `filter` selects a
subset, returning a *shorter* collection. `reduce` collapses a collection into one
value. Searching is a fourth, separate operation: `first(where:)`.

```swift
let prices = [250, 400, 180, 600]

prices.map { $0 * 2 }             // [500, 800, 360, 1200] — same length
prices.filter { $0 > 300 }        // [400, 600]            — shorter
prices.reduce(0, +)               // 1430                  — one value
prices.first(where: { $0 > 300 }) // Optional(400)         — this is searching
```

These three are used constantly and are easy to confuse when first learned, which is
exactly why teaching the distinction badly does lasting damage.

### "`unowned` keeps the object in memory"

**The myth:** `unowned` is a reference that "just stays in memory" because it is neither
strong nor weak.

**The reality:** `unowned` does not retain the object and does not keep it alive. The
real difference from `weak` is that `unowned` is **non-optional** and is never
automatically set to `nil` — so if the object is deallocated and you then access the
reference, the app crashes.

Use `weak` by default. Reach for `unowned` only when you can guarantee the referenced
object outlives the one holding it.

## Grounding everything in one real app

Every topic points back at TicketPlease, which meant no example was invented to suit the
lesson. The persistence chapter is the clearest case — instead of describing five
storage mechanisms abstractly, it shows where each one is actually used:

| Data | Where it lives | Mechanism |
| --- | --- | --- |
| Bookings | `Documents/bookings.json` | FileManager + Codable |
| Profiles | `Documents/profiles.json` | FileManager + Codable |
| Reviews | `Documents/reviews.json` | FileManager + Codable |
| Settings | `CineSeatSettings.plist` | Plist repository |
| Seat layouts | `SeatLayouts.plist` | Plist repository |
| Session & preferences | `UserDefaults` | Key/value |
| Passwords | iOS Keychain | OS-encrypted |
| Posters | `Caches/PosterCache` | URLSession + cache |

Five mechanisms, each chosen for a reason, all visible in one table. A learner can see
immediately that "where do I put this?" has a real answer that depends on what the data
is — and that the password row is different from every other row.

## The build was the curriculum

TicketPlease was built in **eleven dated milestones across roughly three weeks**, and
each milestone leaned on a different topic. Read down the list and you get a second view
of the whole syllabus:

- **01** — UIKit/MVVM scaffold, storyboard tabs, outlets, actions, table views
- **02** — Booking, profile and persistence: Keychain, FileManager JSON
- **03** — Movie data, offline posters, 8 cinemas, varied seat layouts
- **04** — Schedules, notifications, Clean Architecture, DI, DTOs
- **05** — Plist settings, seat database, shared UI constants, first unit tests
- **06** — Showings, MapKit pins, ticket sharing, launch cleanup

That the build history *is* the change list is the point of the documentation chapter,
which uses this exact table as its worked example.

## Writing the documentation chapter changed how I document

Chapter 10 asks what a documented change actually consists of, and settles on five
parts: what changed, why, what it affected, how it was verified, and what is still open.

Two things in it were uncomfortable to write and are the reason I would keep it.

**Documenting AI involvement.** The chapter proposes a four-level scale for recording
how much of a change was AI-assisted, and argues that leaving it unrecorded is the
thing that erodes trust — not the assistance itself.

**Documenting difficulties honestly.** The temptation in any deliverable is to present a
clean narrative where each decision follows from the last. A change list that records
only successes is not a record, it is marketing. The failures are where the reusable
knowledge is.

That principle is why this site has a dated changelog rather than a features page.

## What I would do differently

**The manual is long.** Serving two audiences — a video editor and a self-study reader —
means carrying production cues through material that a reader does not need. It works,
but a shorter reader's edition with the cues stripped would be genuinely more useful for
self-study.

**Verification took longer than writing.** Every technical claim was checked against
Apple's documentation and current sources before it went in. That is slow, and it is
also the only reason the misconceptions register exists. Writing quickly and correcting
later would have produced a document that quietly taught folklore.

**Teaching it exposed what I did not know.** The Keychain accessibility attributes, the
precise semantics of `unowned`, why `402` is a code nobody actually sees — I could have
written working code without knowing any of that. I could not write a paragraph
explaining it to someone else without finding out.

That gap is the argument for writing things down.
