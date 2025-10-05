"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { TopNav } from "../components/top-nav";

type Place = {
  id: string;
  name: string;
  notes: string;
  tags: string;
  visited: boolean;
  createdAt: string;
};

const STORAGE_KEY = "pawplaces::my-places";

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2, 11);
};

export default function MyPlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [formState, setFormState] = useState({
    name: "",
    notes: "",
    tags: "",
  });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Place[];
        setPlaces(parsed);
      }
    } catch (error) {
      console.warn("Unable to load saved places", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
    } catch (error) {
      console.warn("Unable to persist places", error);
    }
  }, [places, isHydrated]);

  const visitedCount = useMemo(
    () => places.filter((place) => place.visited).length,
    [places]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.name.trim()) {
      return;
    }

    const newPlace: Place = {
      id: createId(),
      name: formState.name.trim(),
      notes: formState.notes.trim(),
      tags: formState.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .join(", "),
      visited: false,
      createdAt: new Date().toISOString(),
    };

    setPlaces((prev) => [newPlace, ...prev]);
    setFormState({ name: "", notes: "", tags: "" });
  };

  const toggleVisited = (id: string) => {
    setPlaces((prev) =>
      prev.map((place) =>
        place.id === id ? { ...place, visited: !place.visited } : place
      )
    );
  };

  const removePlace = (id: string) => {
    setPlaces((prev) => prev.filter((place) => place.id !== id));
  };

  return (
    <div className="page">
      <TopNav />

      <main className="my-places">
        <section className="my-places__intro" aria-labelledby="my-places-title">
          <div className="my-places__header">
            <h1 id="my-places-title">Your personal place collection</h1>
            <p>
              Keep track of the parks, cafés, and trails you want to explore with
              your pets. Add a place with a few notes, mark it as visited when
              you go, and build your own local guide.
            </p>
          </div>

          <dl className="my-places__stats" aria-label="Saved places summary">
            <div>
              <dt>Total saved</dt>
              <dd>{places.length}</dd>
            </div>
            <div>
              <dt>Visited</dt>
              <dd>{visitedCount}</dd>
            </div>
            <div>
              <dt>Still to check out</dt>
              <dd>{places.length - visitedCount}</dd>
            </div>
          </dl>
        </section>

        <section className="my-places__form" aria-labelledby="add-place-title">
          <div className="my-places__panel">
            <div className="my-places__panel-header">
              <h2 id="add-place-title">Add a new place</h2>
              <p>Share a quick note so future you remembers what made it special.</p>
            </div>

            <form onSubmit={handleSubmit} className="my-places__form-grid">
              <div className="form-field">
                <label htmlFor="place-name">Place name</label>
                <input
                  id="place-name"
                  name="name"
                  value={formState.name}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  required
                  placeholder="eg. Barkside Café"
                />
              </div>

              <div className="form-field">
                <label htmlFor="place-notes">Notes</label>
                <textarea
                  id="place-notes"
                  name="notes"
                  value={formState.notes}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      notes: event.target.value,
                    }))
                  }
                  placeholder="Cozy patio, great treats, water bowls by the door"
                  rows={3}
                />
              </div>

              <div className="form-field">
                <label htmlFor="place-tags">Tags</label>
                <input
                  id="place-tags"
                  name="tags"
                  value={formState.tags}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      tags: event.target.value,
                    }))
                  }
                  placeholder="Comma separated, eg. patio, shady, water bowls"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Save place
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="my-places__list" aria-labelledby="saved-places-title">
          <div className="my-places__panel">
            <div className="my-places__panel-header">
              <h2 id="saved-places-title">Saved places</h2>
              <p>
                Browse everything you&apos;ve collected. Toggle the visited badge when
                you make the trip!
              </p>
            </div>

            {places.length === 0 ? (
              <p className="my-places__empty">
                You haven&apos;t saved any places yet. Start by adding the spots on
                your wishlist above.
              </p>
            ) : (
              <ul className="my-places__cards">
                {places.map((place) => (
                  <li key={place.id} className="my-places__card">
                    <header>
                      <div className="my-places__card-title">
                        <h3>{place.name}</h3>
                        <button
                          type="button"
                          onClick={() => toggleVisited(place.id)}
                          className={`my-places__status ${
                            place.visited ? "is-visited" : ""
                          }`}
                          aria-pressed={place.visited}
                        >
                          {place.visited ? "Visited" : "Plan to visit"}
                        </button>
                      </div>
                      <p className="my-places__timestamp">
                        Added {new Date(place.createdAt).toLocaleDateString()}
                      </p>
                    </header>

                    {place.notes && <p className="my-places__notes">{place.notes}</p>}

                    {place.tags && (
                      <ul className="my-places__tags" aria-label="Tags">
                        {place.tags.split(", ").map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    )}

                    <div className="my-places__card-actions">
                      <button
                        type="button"
                        className="top-nav__link"
                        onClick={() => toggleVisited(place.id)}
                      >
                        Mark as {place.visited ? "not visited" : "visited"}
                      </button>
                      <button
                        type="button"
                        className="my-places__delete"
                        onClick={() => removePlace(place.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
