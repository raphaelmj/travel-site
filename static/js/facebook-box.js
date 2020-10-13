document.addEventListener('DOMContentLoaded', function () {

    const isHover = e => e.parentElement.querySelector(':hover') === e;
    const hContainer = document.getElementById('facebookMyBox');

    document.addEventListener('mousemove', function checkHover() {

        const hovered = isHover(hContainer);

        if (hovered !== checkHover.hovered) {

            console.log(hovered ? 'hovered' : 'not hovered');
            if (hovered) {
                hContainer.classList.add('open')
                hContainer.classList.remove('close')
            } else {
                hContainer.classList.remove('open')
                hContainer.classList.add('close')
            }

            checkHover.hovered = hovered;
        }
    });
});