// LOAD: Get snippets from localStorage and return them as an array
function load() {
  var data = localStorage.getItem("cv_snippets");
  if (data) {
    return JSON.parse(data); // convert text back into an array
  } else {
    return []; // if nothing saved yet, return empty array
  }
}

// SAVE: Convert the array to text and store it in localStorage
function save(data) {
  localStorage.setItem("cv_snippets", JSON.stringify(data));
}


// HOME PAGE 

// Runs when the user clicks the Save button
function addSnippet() {
  var title = document.getElementById("title").value.trim();
  var code  = document.getElementById("code").value.trim();
  var lang  = document.getElementById("lang").value;
  var tag   = document.getElementById("tag").value.trim().toLowerCase();

  // Stop if title or code is empty
  if (title === "" || code === "") {
    document.getElementById("err").style.display = "block";
    return;
  }

  document.getElementById("err").style.display = "none";

  // Add the new snippet to the front of the list and save
  var snippets = load();
  snippets.unshift({ id: Date.now(), title: title, lang: lang, code: code, tag: tag });
  save(snippets);

  // Clear the form
  document.getElementById("title").value = "";
  document.getElementById("code").value  = "";
  document.getElementById("tag").value   = "";

  renderList();
}

// Runs when the user clicks the Delete button on a card
function deleteSnippet(id) {
  var snippets = load();
  var updated  = [];

  // Copy every snippet EXCEPT the one being deleted
  for (var i = 0; i < snippets.length; i++) {
    if (snippets[i].id !== id) {
      updated.push(snippets[i]);
    }
  }

  save(updated);
  renderList();
}

// Displays all snippets as cards, filtered by the search box
function renderList() {
  var searchText = document.getElementById("searchInput").value.toLowerCase();
  var snippets   = load();
  var filtered   = [];

  // Keep only snippets whose title, language, or tag matches the search
  for (var i = 0; i < snippets.length; i++) {
    var s = snippets[i];
    if (
      s.title.toLowerCase().includes(searchText) ||
      s.lang.toLowerCase().includes(searchText)  ||
      (s.tag && s.tag.toLowerCase().includes(searchText))
    ) {
      filtered.push(s);
    }
  }

  document.getElementById("count").textContent = filtered.length + " snippet(s)";

  var list = document.getElementById("list");

  if (filtered.length === 0) {
    list.innerHTML = "<p>No snippets found.</p>";
    return;
  }

  // Build and display one card per snippet
  var html = "";
  for (var i = 0; i < filtered.length; i++) {
    var s = filtered[i];
    html +=
      '<div class="card">' +
        '<div class="card-top">' +
          '<strong>' + s.title + '</strong>' +
          '<span>' + s.lang + (s.tag ? " · #" + s.tag : "") + '</span>' +
          '<button onclick="deleteSnippet(' + s.id + ')">Delete</button>' +
        '</div>' +
        '<pre>' + s.code + '</pre>' +
      '</div>';
  }
  list.innerHTML = html;
}

// Auto-run renderList when the home page loads
if (document.getElementById("searchInput")) {
  renderList();
}


//  CATEGORIES PAGE 

// Groups snippets by tag and displays each group
function renderCategories() {
  var snippets = load();
  var container = document.getElementById("cat-list");

  if (snippets.length === 0) {
    container.innerHTML = "<p>No snippets saved yet.</p>";
    return;
  }

  // Collect all unique tags
  var tags = [];
  for (var i = 0; i < snippets.length; i++) {
    var tag = snippets[i].tag || "Untagged";
    if (tags.indexOf(tag) === -1) {
      tags.push(tag);
    }
  }
  tags.sort();

  // For each tag, show a heading and all snippets that belong to it
  var html = "";
  for (var t = 0; t < tags.length; t++) {
    html += '<h3>' + tags[t] + '</h3>';
    for (var i = 0; i < snippets.length; i++) {
      var s   = snippets[i];
      var tag = s.tag || "Untagged";
      if (tag === tags[t]) {
        html +=
          '<div class="card">' +
            '<div class="card-top">' +
              '<strong>' + s.title + '</strong>' +
              '<span>' + s.lang + '</span>' +
            '</div>' +
            '<pre>' + s.code + '</pre>' +
          '</div>';
      }
    }
  }

  container.innerHTML = html;
}


// STATISTICS PAGE 

// Counts snippets per language and displays a simple text list
function renderStats() {
  var snippets  = load();
  var container = document.getElementById("stats");

  if (snippets.length === 0) {
    container.innerHTML = "<p>No snippets saved yet.</p>";
    return;
  }

  // Count how many snippets each language has
  var langCount = {};
  for (var i = 0; i < snippets.length; i++) {
    var lang = snippets[i].lang;
    if (langCount[lang]) {
      langCount[lang] = langCount[lang] + 1;
    } else {
      langCount[lang] = 1;
    }
  }

  // Count unique tags
  var tags = [];
  for (var i = 0; i < snippets.length; i++) {
    if (snippets[i].tag && tags.indexOf(snippets[i].tag) === -1) {
      tags.push(snippets[i].tag);
    }
  }

  // Display the results as a simple list
  var html = "<p>Total snippets: <strong>" + snippets.length + "</strong></p>";
  html += "<p>Unique tags: <strong>" + tags.length + "</strong></p>";
  html += "<h3>Snippets by language:</h3><ul>";

  var langKeys = Object.keys(langCount);
  for (var i = 0; i < langKeys.length; i++) {
    html += "<li>" + langKeys[i] + ": " + langCount[langKeys[i]] + "</li>";
  }

  html += "</ul>";
  container.innerHTML = html;
}