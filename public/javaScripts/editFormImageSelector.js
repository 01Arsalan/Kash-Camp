const names = []

document.addEventListener("DOMContentLoaded", function () {
    const images = document.getElementsByClassName("formEditImages")
    const form = document.querySelector("#editForm");

    [...images].forEach(element => {
        element.addEventListener("click", function (e) {
            if (!names.includes(e.target.id)) {
                e.target.classList.add('selected');
                e.target.classList.remove('unselected');
                names.push(e.target.id)
                console.log("ececuted")
            } else {
                e.target.classList.remove('selected');
                e.target.classList.add('unselected');
                
                const index = names.indexOf(e.target.id);
                if (index !== -1) {
                    // Remove the element from the array
                    names.splice(index, 1);
                }
            }
        })
    });
    form.addEventListener("submit", (e) => {
        e.preventDefault()
        const imgData = JSON.stringify(names);
        // collection the names of images in names array and stringifying it into imgData and sending ot as a string by hidden-input's valuse in our form
        document.getElementById('arrayInput').value = imgData;

        form.submit()
    })
})


