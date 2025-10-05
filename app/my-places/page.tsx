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
  updatedAt: string;
};

type PlacesResponse = {
  data?: Place[];
};

type PlaceResponse = {
  data?: Place;
};

export default function MyPlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [formState, setFormState] = useState({
    name: "",
    notes: "",
    tags: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadPlaces() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch("/api/my-places", { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = (await response.json()) as PlacesResponse;
        const data = Array.isArray(payload.data) ? payload.data : [];

        if (!isCancelled) {
          setPlaces(data);
        }
      } catch (error) {
        console.error("Unable to load places", error);

        if (!isCancelled) {
          setErrorMessage(
            "We couldn't load your saved places. Please try again in a moment."
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadPlaces();

    return () => {
      isCancelled = true;
    };
  }, []);

  const visitedCount = useMemo(
    () => places.filter((place) => place.visited).length,
    [places]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.name.trim()) {
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const payload = {
      name: formState.name.trim(),
      notes: formState.notes.trim(),
      tags: formState.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .join(", "),
    };

    try {
      const response = await fetch("/api/my-places", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = (await response.json()) as PlaceResponse;

      if (!result.data) {
        throw new Error("Missing place in response");
      }

      setPlaces((previous) => [result.data, ...previous]);
      setFormState({ name: "", notes: "", tags: "" });
    } catch (error) {
      console.error("Unable to save place", error);
      setErrorMessage(
        "We couldn't save that place. Please check your connection and try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const toggleVisited = async (id: string) => {
    setErrorMessage(null);
    const current = places.find((place) => place.id === id);

    if (!current) {
      return;
    }

    try {
      const response = await fetch(`/api/my-places/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ visited: !current.visited }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = (await response.json()) as PlaceResponse;
      const updated = payload.data;

      if (!updated) {
        throw new Error("Missing place in response");
      }

      setPlaces((previous) =>
        previous.map((place) => (place.id === id ? updated : place))
      );
    } catch (error) {
      console.error("Unable to update place", error);
      setErrorMessage(
        "We couldn't update that place right now. Please try again shortly."
      );
    }
  };

  const removePlace = async (id: string) => {
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/my-places/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      setPlaces((previous) => previous.filter((place) => place.id !== id));
    } catch (error) {
      console.error("Unable to remove place", error);
      setErrorMessage(
        "We couldn't remove that place right now. Please try again shortly."
      );
    }
  };

  return (
    <div className="page">
      <TopNav />

      <main className="my-places">
        {errorMessage && (
          <div role="alert" className="my-places__alert">
            {errorMessage}
          </div>
        )}

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
                <button type="submit" className="btn-primary" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save place"}
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

            {isLoading ? (
              <p className="my-places__empty">Loading your saved places...</p>
            ) : places.length === 0 ? (
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
