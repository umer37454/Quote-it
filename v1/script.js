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
      apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdGZvaHpnbndvdndxZWdsc2NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg4ODQ4ODQsImV4cCI6MTk5NDQ2MDg4NH0.iMzpoZe50FBX4UMG7tTx7wjltqZFWL_m1sgxGMfyW9k",
      authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdGZvaHpnbndvdndxZWdsc2NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg4ODQ4ODQsImV4cCI6MTk5NDQ2MDg4NH0.iMzpoZe50FBX4UMG7tTx7wjltqZFWL_m1sgxGMfyW9k"
    }
  });

  const data = await res.json();
  console.log(data);
}

loadquotes();