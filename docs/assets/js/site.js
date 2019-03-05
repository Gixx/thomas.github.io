document.addEventListener('DOMContentLoaded',function(){
    let moods = document.querySelectorAll('span.mood');
    for (let i = 0, num = moods.length; i < num; i++) {
        moods[i].innerHTML = emojione.toImage(moods[i].innerText);
    }

    let sidebar = document.querySelector('body > nav');
    Stickyfill.add(sidebar);

    document.querySelectorAll('body > header > .container > a').forEach(function(element) {
        element.addEventListener('click', function(e) {
            e.preventDefault();

            let drawerElementTag = e.target.classList[0];
            let menu = document.querySelector('body > '+drawerElementTag);

            if (menu.classList.contains('open')) {
                menu.classList.remove('open');
                menu.classList.add('closing');
                setTimeout(function(){
                    menu.classList.remove('closing');
                }, 1000);
            } else {
                menu.classList.add('opening');
                setTimeout(function(){
                    menu.classList.remove('opening');
                    menu.classList.add('open');
                }, 1000);
            }
        });
    });
});
