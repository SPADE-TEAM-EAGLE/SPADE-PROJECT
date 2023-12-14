const field = document.getElementById('typehead');
const ac = new Autocomplete(field, {
    data: [{label: "I'm a label", value: 42}],
    maximumItems: 100,
    threshold: 1,
    onSelectItem: ({label, value}) => {
      // console.log("user selected:", label, value);
    }
});
