// blog.js

const BLOG_ID = "2b806db8-3f06-4b13-8f47-e1475dbe04b5";

const API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5YWQxODQzOC1lMzAyLTRiMmYtYmNjZC03ZjNhZmM0MTU1ZDAiLCJqdGkiOiIxMzYyMTg4YTA3ZTM0YjBjZmRhMDc4NTZlYTI4ZTBlMTllYzgwODRhZGZiZjhhMjI0Mzg3OTNjMDJiMDliZjk2NDEyMGIxZDY0NTJmOTZhMCIsImlhdCI6MTc4MjgyNDkwMi40NjM4NDEsIm5iZiI6MTc4MjgyNDkwMi40NjM4NDUsImV4cCI6MjU3MTc0MzMwMi4zMzA3NDMsInN1YiI6IjcwNDU3MDYwNTUwMyIsInNjb3BlcyI6W119.Qq5nzxEK8DpcykBN7DqzU6izD8Abp3gcWO1o9VkENdOSJhr1hztNfD2x2BlMUAg2Zx2Cp28WZa-fQmT-ARjD2q42iQTnuEoQtKb-zXebFb_ur1VJELh2nRQvyYX3fX4IXhq_TpZfMImxXy3LVfMcjQ6xhP8YTd-ugRIR9o9vRaCkHLncqL1kLnZmbdWf2sP9Kk3vodV3PChDDivA-MWmbRVxYr9vjTYlmzpC-ZfysV147dR-occkjNh4BerefmSs9u_d_4JOoftS6HV7xzrj9yM14kuL8ECZnQBxOAl7dUIkvmD0gxWnVXGRcG6Pg-mr07O6fCG5MybphE_egnXbtbLPnfjYbD0SMu7ffBswgFkPxhwqXMDb62C9004x0vwVSB5dvMW4ZtfMfUwja2wVZt0PkiOXU61OIeh6ZLVeG1XIhaqo9RHjUKaisaw-3hj7LbH4iAeL-Xh14OUbvqgAaD0pBxBW0IZQu4-eTRir_6TrE7RCAHf_KhGPaBmP0e5doyXth9vkTad9xCw6wsGiiswcQ-ppdYhav3_ckK-JR9kOhlU5l4EVDNBoq4bN7sVNRc2Zh2wv_R1OkJgXExLHUAQ2fzABpufhUthCK_-FQgGrpyV7iOtf-VKfUFbU29QCLbyjw--TZI9HFa_Jo5dqpJ7rmHH5CQH808wmMm3VH8s";

// How many posts to show on the homepage
const MAX_POSTS = 4;

// API URL — now actually asks DropInBlog for only MAX_POSTS posts
const API_URL = `https://api.dropinblog.com/v2/blog/${BLOG_ID}/posts?limit=${MAX_POSTS}`;

// Blog Container
const blogContainer = document.getElementById("latestBlogs");

// ----------------------------
// LOAD BLOGS
// ----------------------------

async function loadBlogs() {

    if (!blogContainer) {
        console.error("Container #latestBlogs not found.");
        return;
    }

    blogContainer.innerHTML = `
        <div class="loading">
            Loading latest blogs...
        </div>
    `;

    try {

        const response = await fetch(API_URL, {

            method: "GET",

            headers: {

                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"

            }

        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        // Keep this while you're testing, comment out once everything looks right.
        console.log("DropInBlog response:", data.data.posts);

        const posts = data.data.posts || [];

        displayBlogs(posts);

    }

    catch (error) {

        console.error(error);

        blogContainer.innerHTML = `
            <div class="error">
                Unable to load blogs.
            </div>
        `;

    }

}

// ----------------------------
// DISPLAY BLOGS
// ----------------------------

function displayBlogs(posts) {

    if (!posts.length) {

        blogContainer.innerHTML = `
            <div class="error">
                No blogs found.
            </div>
        `;

        return;

    }

    // Belt-and-suspenders: sort newest-first and cap at MAX_POSTS,
    // so the homepage always shows exactly the 5 most recent posts
    // even if the API's default ordering ever changes.
    const sortedPosts = [...posts]
        .sort((a, b) => {
            const dateA = new Date(a.publishedAt || a.published_at || a.date || 0);
            const dateB = new Date(b.publishedAt || b.published_at || b.date || 0);
            return dateB - dateA;
        })
        .slice(0, MAX_POSTS);

    blogContainer.innerHTML = "";

    sortedPosts.forEach(post => {

        const title =
            post.title || "Untitled";

        const image =
            post.featuredImage ||
            post.featured_image ||
            post.image ||
            "images/blog-placeholder.jpg";

        const summary =
            post.summary ||
            post.excerpt ||
            post.description ||
            "";

        const slug =
            post.slug || "";

        const url =
            slug
                ? `blog.html?p=${slug}`
                : "#";

        const published =
            post.publishedAt ||
            post.published_at ||
            post.date ||
            "";

        blogContainer.innerHTML += `

        <div class="blog-card">

            <div class="blog-image">

                <img
                    src="${image}"
                    alt="${title}"
                    loading="lazy"
                >

            </div>

            <div class="blog-content">

                <p class="blog-date">

                    ${formatDate(published)}

                </p>

                <h3>

                    ${title}

                </h3>

                <p class="blog-summary">

                    ${truncate(stripHtml(summary), 120)}

                </p>

                <a
                    href="${url}"
                    class="blog-btn"
                >
                    Read More →
                </a>

            </div>

        </div>

        `;

    });

}

// ----------------------------
// FORMAT DATE
// ----------------------------

function formatDate(dateString) {

    if (!dateString) return "";

    return new Date(dateString).toLocaleDateString("en-US", {

        year: "numeric",
        month: "long",
        day: "numeric"

    });

}

// ----------------------------
// STRIP HTML (in case summary/excerpt comes back as HTML, not plain text)
// ----------------------------

function stripHtml(text) {

    if (!text) return "";

    return text.replace(/<[^>]*>/g, "");

}

// ----------------------------
// LIMIT SUMMARY LENGTH
// ----------------------------

function truncate(text, length) {

    if (!text) return "";

    if (text.length <= length)
        return text;

    return text.substring(0, length) + "...";

}

// ----------------------------
// START
// ----------------------------

document.addEventListener("DOMContentLoaded", () => {

    loadBlogs();

});