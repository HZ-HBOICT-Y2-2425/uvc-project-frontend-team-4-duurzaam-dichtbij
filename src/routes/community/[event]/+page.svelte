<script>
  // @ts-nocheck
  import { onMount } from "svelte";
  import { page } from "$app/stores"; // To access route parameters
  import { goto, afterNavigate } from "$app/navigation";
  import Layout from "../../layout.svelte";
  import { users } from "$lib/users";

  const base = "/";
  let previousPage = base;

  afterNavigate(({ from }) => {
    console.log(base);
    previousPage = from?.url.pathname || previousPage;
    if (
      previousPage.toLocaleLowerCase() ===
        window.location.pathname.toLocaleLowerCase() ||
      previousPage.replace(" ", "") == ""
    ) {
      previousPage = base;
    }
  });

  let event = null; // Market data
  let error = null;
  let storedUser = null;
  let storedUserNames = [];
  let applied = null; // Track applied status
  let comment = "";

  let replyContent = "";

  // Load data on mount
  onMount(async () => {
    const eventId = $page.params.event;
    storedUser = JSON.parse(localStorage.getItem("user"));
    await fetchEventDetails(eventId);
    if (storedUser) {
      await fetchAppliedStatus(eventId, storedUser.id);
    }

    event.appliedUsers.forEach((user) => {
      const userName = users.find((u) => u.id === user)?.name;

      if (userName) {
        storedUserNames = [...storedUserNames, userName];
      }
    });
  });

  // Fetch event details
  const fetchEventDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:3010/events/event/${id}`);
      if (!response.ok)
        throw new Error(
          `Failed to fetch event details: ${response.statusText}`,
        );
      event = await response.json();
    } catch (err) {
      error = err.message;
    }
  };

  const getUserNameById = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : undefined;
  };

  // Check if user is applied
  const fetchAppliedStatus = async (eventId, userId) => {
    try {
      const response = await fetch(
        `http://localhost:3010/events/events/${eventId}/apply/${userId}`,
      );
      if (!response.ok)
        throw new Error(
          `Failed to fetch application status: ${response.statusText}`,
        );
      applied = await response.json();
    } catch (err) {
      error = err.message;
    }
  };

  const applyEvent = async (eventId, userId) => {
    try {
      const response = await fetch(
        `http://localhost:3010/events/events/${eventId}/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user: userId }),
        },
      );
      if (!response.ok)
        throw new Error(`Failed to apply: ${response.statusText}`);
      await fetchAppliedStatus(eventId, userId); // Update applied status
      await fetchEventDetails(eventId);

      storedUserNames = event.appliedUsers.map((user) => getUserNameById(user));
    } catch (err) {
      error = err.message;
    }
  };

  const deApplyEvent = async (eventId, userId) => {
    try {
      const response = await fetch(
        `http://localhost:3010/events/events/${eventId}/apply`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user: userId }),
        },
      );
      if (!response.ok)
        throw new Error(`Failed to de-apply: ${response.statusText}`);
      await fetchAppliedStatus(eventId, userId); // Update applied status
      await fetchEventDetails(eventId);

      storedUserNames = event.appliedUsers.map((user) => getUserNameById(user));
    } catch (err) {
      error = err.message;
    }
  };

  const deleteEvent = async (id) => {
    try {
      const response = await fetch(`http://localhost:3010/events/event/${id}`, {
        method: "DELETE",
      });
      if (!response.ok)
        throw new Error(`Failed to delete event: ${response.statusText}`);
      goto("/community");
    } catch (err) {
      error = err.message;
    }
  };

  const createComment = async (eventId, userName, comment) => {
    try {
      const response = await fetch(
        `http://localhost:3010/events/events/${eventId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: userName, content: comment }),
        },
      );
      if (!response.ok)
        throw new Error(`Failed to create comment: ${response.statusText}`);
      await fetchEventDetails(eventId);
    } catch (err) {
      error = err.message;
    }
  };

  const getComments = async (eventId) => {
    try {
      const response = await fetch(
        `http://localhost:3010/events/events/${eventId}/comments`,
      );
      if (!response.ok)
        throw new Error(`Failed to fetch comments: ${response.statusText}`);
      return await response.json();
    } catch (err) {
      error = err.message;
    }
  };

  const updateComment = async (eventId, commentId, content) => {
    try {
      const response = await fetch(
        `http://localhost:3010/events/events/${eventId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(content),
        },
      );
      if (!response.ok)
        throw new Error(`Failed to update comment: ${response.statusText}`);
      await fetchEventDetails(event.id);
    } catch (err) {
      error = err.message;
    }
  };

  const deleteComment = async (eventId, commentId) => {
    try {
      const response = await fetch(
        `http://localhost:3010/events/events/${eventId}/comments/${commentId}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok)
        throw new Error(`Failed to delete comment: ${response.statusText}`);
      await fetchEventDetails(event.id);
    } catch (err) {
      error = err.message;
    }
  };

  const createReply = async (eventId, commentId, userName, content) => {
    try {
      const response = await fetch(
        `http://localhost:3010/events/events/${eventId}/comments/${commentId}/replies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: userName, content: content }),
        },
      );
      if (!response.ok)
        throw new Error(`Failed to create reply: ${response.statusText}`);
      await fetchEventDetails(eventId);
    } catch (err) {
      error = err.message;
    }
  };

  const updateReply = async (eventId, commentId, replyId, userName, content) => {
    try {
      const response = await fetch(
        `http://localhost:3010/events/events/${eventId}/comments/${commentId}/replies/${replyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: userName, content: content }),
        },
      );
      if (!response.ok)
        throw new Error(`Failed to update reply: ${response.statusText}`);
      await fetchEventDetails(eventId);
    } catch (err) {
      error = err.message;
    }
  };

  const deleteReply = async (eventId, commentId, replyId) => {
    try {
      const response = await fetch(
        `http://localhost:3010/events/events/${eventId}/comments/${commentId}/replies/${replyId}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok)
        throw new Error(`Failed to delete reply: ${response.statusText}`);
      await fetchEventDetails(eventId);
    } catch (err) {
      error = err.message;
    }
  };
</script>

<Layout>
  <main class="min-h-screen bg-gray-100 py-8 px-4">
    {#if error}
      <p class="text-center text-red-500 font-medium">Error: {error}</p>
    {:else if !event}
      <p class="text-center text-gray-500 font-medium">
        Evenementdetails aan het laden...
      </p>
    {:else}
      <div class="space-y-3">
        <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <div class="flex justify-between">
            <h1 class="text-3xl font-bold text-gray-800 mb-4">{event.name}</h1>
            <button
              id="copylink"
              on:click={() => {
                const copyButton = document.getElementById("copylink");
                if (copyButton) copyButton.innerText = "Link gekopieerd!";
                navigator.clipboard.writeText(window.location.href);
              }}
              class="bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition"
              >Deel</button
            >
          </div>

          <p class="text-gray-600 mb-6">{event.description}</p>

          <div class="flex flex-wrap gap-6">
            <div class="flex-1">
              <h2 class="text-lg font-semibold text-gray-700 mb-2">Details</h2>
              <ul class="text-gray-600 space-y-2">
                <li><strong>Categorie</strong> {event.type}</li>
                <li>
                  <strong>Begin</strong>
                  {new Date(event.startDate).toLocaleString()}
                </li>
                <li>
                  <strong>Eind</strong>
                  {new Date(event.endDate).toLocaleString()}
                </li>
              </ul>
            </div>
            <div class="flex-1">
              <h2 class="text-lg font-semibold text-gray-700 mb-2">Locatie</h2>
              <ul class="text-gray-600 space-y-2">
                <li><strong>Stad</strong> {event.location.city}</li>
                <li><strong>Adres</strong> {event.location.address}</li>
              </ul>
            </div>
          </div>

          <div class="mt-8 text-center flex justify-between">
            <a
              href={previousPage}
              class="bg-green-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-600 transition"
            >
              Terug
            </a>
            {#if storedUser}
              {#if applied === null}
                <button
                  class="bg-green-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-600 transition"
                >
                  Aanmeldstatus ophalen...
                </button>
              {:else if applied}
                <button
                  on:click={() => deApplyEvent(event.id, storedUser.id)}
                  class="bg-red-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-600 transition"
                >
                  Afmelden
                </button>
              {:else}
                <button
                  on:click={() => applyEvent(event.id, storedUser.id)}
                  class="bg-green-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-600 transition"
                >
                  Aanmelden
                </button>
              {/if}
            {/if}
            <a
              href="/community/{event.id}/edit"
              class="bg-orange-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-orange-600 transition"
            >
              Bewerken
            </a>
            <button
              on:click={() => deleteEvent(event.id)}
              class="bg-red-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-600 transition"
            >
              Verwijderen
            </button>
          </div>
        </div>
        <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          {#if storedUserNames.length > 0}
            <h2 class="text-lg font-semibold text-gray-700 mb-4">
              Gebruikers die zich hebben aangemeld
            </h2>
          {:else}
            <h2 class="text-lg font-semibold text-gray-700 mb-4">
              Er hebben zich nog geen gebruikers aangemeld
            </h2>
          {/if}
          <ul class="space-y-3">
            {#each storedUserNames as userName}
              <li
                class="flex justify-between space-x-5 bg-gray-100 p-3 rounded-lg shadow-sm hover:bg-gray-200 transition"
              >
                <img
                  src="/profile_picture.png"
                  alt="Profielfoto"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <span class="text-lg pt-1 font-medium text-gray-800"
                  >{userName}</span
                >
              </li>
            {/each}
          </ul>
        </div>
        <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-700 mb-4">Reacties</h2>
          {#if storedUser}
            <form
              on:submit|preventDefault={() =>
                createComment(event.id, storedUser.id, comment)}
            >
              <textarea
                bind:value={comment}
                class="w-full h-24 bg-gray-100 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                placeholder="Schrijf een reactie..."
              ></textarea>
              <button
                type="submit"
                class="bg-green-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-600 transition mt-3"
              >
                Plaatsen
              </button>
            </form>
          {:else}
            <p class="text-gray-600">Log in om een reactie te plaatsen</p>
          {/if}
          <ul class="max-w-4xl mx-auto pt-8 space-y-3">
            {#await getComments(event.id)}
              <p class="text-center text-gray-500 font-medium">
                Reacties aan het laden...
              </p>
            {:then comments}
              {#if comments.length > 0}
                {#each comments as comment}
                  <li class="bg-gray-100 flex flex-col rounded-lg shadow-sm p-3 relative">
                    <div class="flex space-x-3">
                      <img class="w-10 h-10 rounded-full object-cover" alt="Profilepicture" src="/profile_picture.png" />
                      <div>
                        <p class="text-lg font-medium">{getUserNameById(comment.username)}</p>
                        {#if comment.isEditingComment}
                          <form
                            on:submit|preventDefault={() => {
                              updateComment(event.id, comment.id, { username: comment.username, content: comment.content });
                              comment.isEditingComment = false;
                            }}
                          >
                            <div class="flex space-x-2">
                              <input
                                bind:value={comment.content}
                                class="border-2 border-black w-full bg-gray-100 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                              />
                              {#if comment.content !== ""}
                                <button
                                  type="submit"
                                  class="bg-green-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-600 transition mt-3"
                                >
                                  Opslaan
                                </button>
                              {/if}
                              <button 
                                on:click={() => {comment.showEditOptions = false; comment.isEditingComment = false}}
                                class="bg-red-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-600 transition mt-3"
                              >
                                Annuleer
                              </button>
                            </div>
                          </form>
                        {:else}
                        <p>{comment.content}</p>
                        {/if}
                      </div>
                    </div>

                    <div class="flex space-x-4 mt-2">
                      <button
                        on:click={() => {comment.isCreatingReply = true;}}
                        class="text-blue-500 hover:text-blue-600 transition"
                        title="Reageren"
                        aria-label="Reageren"
                      >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-reply" viewBox="0 0 16 16">
                        <path d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822.984.624 1.99 1.76 2.595 3.876-1.02-.983-2.185-1.516-3.205-1.799a8.7 8.7 0 0 0-1.921-.306 7 7 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254l-.042-.028a.147.147 0 0 1 0-.252l.042-.028zM7.8 10.386q.103 0 .223.006c.434.02 1.034.086 1.7.271 1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96z"/>
                      </svg>
                      </button>
                    </div>

                    {#if comment.isCreatingReply}
                      <form
                        on:submit|preventDefault={() => {
                        createReply(event.id, comment.id, storedUser.id, replyContent);
                        comment.isCreatingReply = false;
                       }}
                      >
                        <div class="flex space-x-2 pt-1.5">
                          <input
                            bind:value={replyContent}
                            class="border-2 border-black w-full bg-gray-100 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                          />
                          {#if replyContent == ""}
                            <button
                              type="button"
                              class="bg-green-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-600 transition mt-3"
                            >
                              Opslaan
                            </button>
                          {:else}
                            <button
                              type="submit"
                              class="bg-green-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-600 transition mt-3"
                            >
                              Opslaan
                            </button>
                          {/if}
                          <button
                            on:click={() => comment.isCreatingReply = false}
                            class="bg-red-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-600 transition mt-3"
                          >
                            Annuleer
                          </button>
                        </div>
                      </form>
                    {/if}
                  
                    {#each comment.replies as reply}
                      <div class="ml-10 mt-3 flex space-x-3 relative">
                        <img class="w-8 h-8 rounded-full object-cover" alt="Reply Profilepicture" src="/profile_picture.png" />
                        <div>
                          <p class="text-md font-medium">{getUserNameById(reply.username)}</p>
                          {#if reply.isEditingReply}
                            <form
                              on:submit|preventDefault={() => {
                                updateReply(event.id, comment.id, reply.id, reply.username, reply.content);
                                reply.isEditingReply = false;
                              }}
                            >
                              <div class="flex space-x-2">
                                <input
                                  bind:value={reply.content}
                                  class="border-2 border-black w-full bg-gray-100 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                />
                                {#if reply.content !== ""}
                                  <button
                                    type="submit"
                                    class="bg-green-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-600 transition mt-3"
                                  >
                                    Opslaan
                                  </button>
                                {/if}
                                <button 
                                  on:click={() => {reply.showEditOptions = false; reply.isEditingReply = false}}
                                  class="bg-red-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-600 transition mt-3"
                                >
                                  Annuleer
                                </button>
                              </div>
                            </form>
                          {:else}
                            <p>{reply.content}</p>
                          {/if}
                        </div>
                      
                        {#if getUserNameById(reply.username) === storedUser.name && !reply.isEditingReply}
                          <div class="absolute right-2">
                            <button 
                              on:click={() => (reply.showEditOptions = !reply.showEditOptions)} 
                              class="text-3xl"
                            >
                              ...
                            </button>
                            {#if reply.showEditOptions}
                              <div class="absolute right-0 top-8 bg-white shadow-lg rounded-lg p-2 space-y-2 z-10">
                                <button
                                  on:click={() => {reply.isEditingReply = true;}}
                                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg"
                                >
                                  Bewerken
                                </button>
                                <button
                                  on:click={() => deleteReply(event.id, comment.id, reply.id)}
                                  class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-200 rounded-lg"
                                >
                                  Verwijderen
                                </button>
                              </div>
                            {/if}
                          </div>
                        {/if}
                      </div>
                    {/each}

       
                    {#if getUserNameById(comment.username) === storedUser.name && !comment.isEditingComment}
                      <div class="absolute right-2">
                        <button 
                          on:click={() => (comment.showEditOptions = !comment.showEditOptions)} 
                          class="text-3xl"
                        >
                          ...
                        </button>
                        {#if comment.showEditOptions}
                          <div class="absolute right-0 top-8 bg-white shadow-lg rounded-lg p-2 space-y-2 z-10">
                            <button
                              on:click={() => {comment.isEditingComment = true;}}
                              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg"
                            >
                              Bewerken
                            </button>
                            <button
                              on:click={() => deleteComment(event.id, comment.id)}
                              class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-200 rounded-lg"
                            >
                              Verwijderen
                            </button>
                          </div>
                        {/if}
                      </div>
                    {/if}
                  </li>
                {/each}                     
              {:else}
                <p class="text-center text-gray-500 font-medium">
                  Er zijn nog geen reacties geplaatst
                </p>
              {/if}
            {:catch err}
              <p class="text-center text-red-500 font-medium">Error: {err}</p>
            {/await}
          </ul>
        </div>
      </div>
    {/if}
  </main>
</Layout>
