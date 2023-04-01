//selecting dom elements
const btnShare = document.querySelector(".btn-share");
const form = document.querySelector(".quote-form");

//toggle form visibility
btnShare.addEventListener("click", () => {
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    btnShare.textContent = "Close";
  } else {
    form.classList.add("hidden");
    btnShare.textContent = "Share a quote";
  }
});

//fetching data
async function loadquotes() {
  const res = await fetch("https://djtfohzgnwovwqeglscb.supabase.co/rest/v1/quotes", {
    headers: {
      apikey: "",
      authorization: ""
    }
  });

  const data = await res.json();
  console.log(data);
}

loadquotes();