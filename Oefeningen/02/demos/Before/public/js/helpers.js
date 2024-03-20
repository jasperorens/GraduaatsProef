function showEvents(events) {
    let markup = '';
    events.forEach(event => {
        markup += `
            <tr class="align-middle">
                <td>
                    <img class="img-fluid max-100" src="img/${event.imgUrl}" alt="Cover" />
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
                    <button type="button" class="btn btn-primary btn-primary-themed btn-md font-upper" onclick="document.getElementById('spanTickets').innerHTML = ++(document.getElementById('spanTickets').innerHTML)">Add to Cart</button>
                </td>
            </tr>
        `;
    });
    document.querySelector('#eventtable table tbody').innerHTML = markup;
}