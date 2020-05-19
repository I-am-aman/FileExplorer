const children = $('tbody').children();

let childrenArray = [];
for(let i = 0; i < children.length; i++)
    childrenArray.push(children[i]);

const items = [];
childrenArray.forEach(element => {
    const rowDetails = {
        name: element.getAttribute('data-name'),
        size: parseInt(element.getAttribute('data-size')),
        time: parseInt(element.getAttribute('data-time')),
        html: element.outerHTML
    };
    items.push(rowDetails);
});

const sortStatus = {
    name: 'none',
    // size:,
    // time:
}

const sort_name = (items, option) => {
    items.sort((item1, item2) => {
        const name1 = item1.name.toUpperCase();
        const name2 = item2.name.toUpperCase();
        if(name1 < name2)
            return -1;
        else if(name1 > name2)
            return 1;
        return 0;
    });
    if(option === 'down')
        items.reverse();
};

const fill_table_body = items => {
    const content = items.map(element => element.html).join('');
    $('tbody').html(content);
};

document.getElementById('table_head_row').addEventListener('click', event => {
    if(event.target){
        $('ion-icon').remove();

        if(event.target.id === 'name'){
            if(['none', 'down'].includes(sortStatus.name)){
                sort_name(items, 'up');
                sortStatus.name = 'up';

                event.target.innerHTML += ' <ion-icon name="caret-up-circle"></ion-icon>';
            }
            else if(sortStatus.name === 'up'){
                sort_name(items, 'down');
                sortStatus.name = 'down';

                event.target.innerHTML += ' <ion-icon name="caret-down-circle"></ion-icon>';
            }
        
            fill_table_body(items);
        }
    }
});