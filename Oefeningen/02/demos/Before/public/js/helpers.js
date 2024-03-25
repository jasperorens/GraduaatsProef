function showEvents(events) {
    let markup = '';
    events.forEach(event => {
        markup += `
            <tr class="align-middle">
                <td>
                    <div class="img-container">
                        <img class="img-fluid max-100" src="img/${event.imgUrl}" alt="Cover">
                    </div>
                </td>
                <td class="max-50">
                    ${new Date(event.date).toLocaleString()}
                </td>
                <td class="max-50">
                    ${event.name}
                </td>
                <td class="max-50">
                    ${event.artist}
                </td>
                <td class="max-50">
                    $${event.price}
                </td>
                <td class="max-50">
                    <button type="button" data-event-id="${event.id}" class="btn btn-primary btn-primary-themed btn-md font-upper" onclick="addToCart(this.getAttribute('data-event-id'), 1)">Add to Cart</button>
                </td>
            </tr>
        `;
    });
    document.querySelector('#eventtable table tbody').innerHTML = markup;
}

function updateCart(cart) {
    const count = cart.reduce((n, { quantity }) => n + quantity, 0);
    document.getElementById('spanTickets').textContent = count;
}

function showImage(img, id) {
    document.querySelector(`img[data-event-id='${id}']`).setAttribute('src', img);
}

function showError(message) {
    document.querySelector('#eventtable table tbody').innerHTML = '';
    var output = document.createElement('div');
    output.classList.add('alert', 'alert-danger');
    output.textContent = message;
    document.getElementById('eventtable').after(output);
}

function decodeChunks(chunks) {
    const total = chunks.reduce((n, c) => n + c.length, 0);
    let data = new Uint8Array(total);
    let seek = 0;
    chunks.forEach(chunk => {
        data.set(chunk, seek);
        seek += chunk.length;
    });
    return new TextDecoder('utf-8').decode(data);
}

function showProgress(value, id) {
    document.querySelector(`div.img-progress[data-event-id='${id}']`).innerHTML = value;
}

function removeProgress(id) {
    document.querySelector(`div.img-progress[data-event-id='${id}']`).innerHTML = '';
}