fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => response.json())
    .then(user => {
        user.forEach(item => {
            let userDiv = document.createElement("div");
            userDiv.classList.add('user');
            userDiv.innerHTML = `
            <p>UserID: ${item.id}</p>
            <p>Username: ${item.name} ${item.username}</p>
            <div class='divButton'>
            <button class="showInfoUser">About user</button>
            <button class="showAllPosts">User posts</button>
            </div>
            <div class="aboutUser display-none"></div>
            <div class="userPosts display-none"></div>
            <div class="formForAdd display-none"></div>
            `;
            document.querySelector('.body').appendChild(userDiv);
            let showAboutUserButton = userDiv.querySelector('.showInfoUser');
            showAboutUserButton.addEventListener('click', () => showInfoUser(item, userDiv));
            let showPostsButton = userDiv.querySelector('.showAllPosts');
            showPostsButton.addEventListener('click', () => showUserPosts(item, userDiv));
        })
    });

function showInfoUser(item, container) {
    let aboutUser = container.querySelector('.aboutUser');
    aboutUser.innerHTML = `
        <p>Phone: ${item.phone}</p>
        <p>Email: ${item.email}</p>
        <p>Website: ${item.website}</p>
        <p>Name of company: ${item.company.name}</p>
        <p>Catch phrase: ${item.company.catchPhrase}</p>
        <p>bs: ${item.company.bs}</p>
        <p>Street: ${item.address.street}</p>
        <p>Suite: ${item.address.suite}</p>
        <p>City: ${item.address.city}</p>
        <p>Zipcode: ${item.address.zipcode}</p>
        <p>Lat: ${item.address.geo.lat}</p>
        <p>Lng: ${item.address.geo.lng}</p>
    `;
    aboutUser.classList.toggle('display-none');
}

function showUserPosts(user, container) {
    let postBlocks = container.querySelector('.userPosts');
    postBlocks.classList.toggle('display-none');
    let formContainer = container.querySelector('.formForAdd');
    formContainer.classList.add('display-none');
    if (!postBlocks.classList.contains('display-none')) {
        fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`)
            .then(response => response.json())
            .then(posts => {
                posts.forEach(item => {
                    let activePost = postBlocks.querySelector(`[data-post-id="${item.id}"]`);
                    if (!activePost) {
                        let postDiv = document.createElement('div');
                        postDiv.classList.add('userPostsBlock');
                        postDiv.dataset.postId = item.id;
                        postDiv.innerHTML = `
                            <h4 class="postTitle">${item.title}</h4>
                            <p class="postBody display-none">${item.body}</p>
                        `;
                        let postTitle = postDiv.querySelector('.postTitle');
                        let postBody = postDiv.querySelector('.postBody');
                        postDiv.addEventListener('click', function () {
                            postBody.classList.toggle('display-none');
                        });
                        postBlocks.prepend(postDiv);
                    }
                });

                let addPostButton = postBlocks.querySelector('.addFormButton');
                if (!addPostButton) {
                    addPostButton = document.createElement('button');
                    addPostButton.textContent = 'New post';
                    addPostButton.classList.add('addFormButton');
                    addPostButton.addEventListener('click', () => showFormForAdd(user, container));
                    postBlocks.appendChild(addPostButton);
                }
            });
    }
}

function showFormForAdd(user, container) {
    let formContainer = container.querySelector('.formForAdd');
    const postTitleId = `postTitle_${user.id}`;
    const postBodyId = `postBody_${user.id}`;
    formContainer.innerHTML = `
        <label>Title:</label>
        <input type="text" id="${postTitleId}" class="postBodyInput" required><br>
        <label>Body:</label>
        <input type="text" id="${postBodyId}" class="postTitleInput" required><br>
        <button class="addPostButton">Add Post</button>
    `;
    formContainer.classList.toggle('display-none');


    formContainer.querySelector(".addPostButton").addEventListener('click', function () {
        const postTitle = document.getElementById(postTitleId).value;
        const postBody = document.getElementById(postBodyId).value;
        if (postTitle === "" && postBody === "" || postTitle === "" || postBody === "") {
            alert("Fill input values!");
        } else if (postTitle !== "" || postBody !== "") {
            fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    title: postTitle,
                    body: postBody
                }),
            })
                .then(response => response.json())
                .then(newPost => {
                    console.log('New post added:', newPost);
                    document.getElementById(postTitleId).value = '';
                    document.getElementById(postBodyId).value = '';

                    let postBlocks = container.querySelector('.userPosts');
                    let postDiv = document.createElement('div');
                    postDiv.classList.add('userPostsBlock');
                    postDiv.dataset.postId = newPost.id;
                    postDiv.innerHTML = `
                    <h4 class="postTitle">${newPost.title}</h4>
                    <p class="postBody display-none">${newPost.body}</p>
                `;
                    let postTitle = postDiv.querySelector('.postTitle');
                    let postBody = postDiv.querySelector('.postBody');
                    postTitle.addEventListener('click', function () {
                        postBody.classList.toggle('display-none');
                    });
                    postBlocks.prepend(postDiv);
                });
        }
    });
};