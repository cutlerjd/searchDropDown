/* 
This component is for creating a faux <select> element that also has a search box to it. Search is a 'contains' and not a begins with.
Expected bindings:
@id - The ID of the actual <select> box created that can be used in form submission and JQuery
@items - Array, with objects that have a 'value' and 'text'.
@dropDownIcon - the 'src' attribute of the image to use for a drop down icon.
@clearSearchIcon - the 'src' attribute of the image to use for a clearing a search input box.
CSS styling can be applied to:
.searchDropDown-container - Whole container of element
.searchDropDown-inputContainer - Div that contains input element and icons
.searchDropDown-dropDownIcon, searchDropDown-clearSearchIcon - Img icons
.searchDropDown-input - Input box
.searchDropDown-dropDownContainer - Div that shows with containing div of options to select
.searchDropDown-dropDownItem - Individual div's of results.
*/

Vue.component('searchdropdown', {
    props: ['id', 'items','dropDownIcon','clearSearchIcon'],
    data: function () {
        return {
            selected: "",
            selectedKeyValue: { value: "", text: "" },
            search: "",
            dropDownVisible: false,
            clearSearchVisible: false,
            css_dropDownIcon: {
                right: "2px",
                height: "15px",
                position: "absolute",
                top: "2px",
                boxSizing: "border-box"
            },
            css_clearSearchIcon: {
                right: "20px",
                height: "15px",
                position: "absolute",
                top: "2px",
                boxSizing: "border-box",
            },
            css_inputContainer: {
                width: "inherit",
                position: "relative",
                boxSizing: "border-box"
            },
            css_container: {
                display: "inline-block",
                boxSizing: "border-box",
                width:"inherit"
            },
            css_dropDownContainer: {
                position: "absolute",
                width: "inherit",
                maxHeight: "100px",
                overflowX: "hidden",
                overflowY: "auto",
                boxSizing: "border-box",
                zIndex: "1"
            },
            css_searchDropDownInput: {
                width: "inherit",
                boxSizing: "border-box"
            }
        }
    },
    computed: {
        filterList: function () {
            return this.items.filter(function (item) {
                if (item.text.toLowerCase().indexOf(this.search.toLowerCase()) != -1) {
                    return true
                } else {
                    return false
                }
            }.bind(this))
        }
    },
    methods: {
        getTextField: function(value){
            return this.items.reduce(function(acc,curr){
                if(curr.value == value){
                    return curr.text
                }else{
                    return acc
                }
            })
        },
        clearSearch: function () {
            this.clearSelected()
            this.setSearchInput("")
            this.clearSearchVisible = false
        },
        clearSelected: function () {
            this.setOption("", "")
        },
        itemClicked: function (value) {
            this.setSearchInput(this.getTextField(value));
            this.setOption(value, this.getTextField(value));
            this.dropDownVisible = false;
        },
        processInputField: function (event) {
            if (event.key === "Backspace") {
                this.clearSelected()
            } else if (this.search.length > 0) {
                this.dropDownVisible = true;
            }
            if (this.search.length === 0) {
                this.clearSearchVisible = false
            }
        },
        setDropDownVisible: function (value) {
            this.dropDownVisible = value;
        },
        setOption: function (optionValue, optionText) {
            this.selectedKeyValue = [{
                value: optionValue,
                text: optionText
            }]
        },
        setSearchInput: function (text) {
            this.search = text;
        },
        setSelected: function (value) {
            this.selected = value
        },
        toggleDropDownVisible: function () {
            if (this.dropDownVisible) {
                this.dropDownVisible = false
            } else {
                this.dropDownVisible = true
            }
        },

    },
    watch: {
        search: function (a) {
            if (a[0]) {
                if (a[0].length != 0) {
                    this.clearSearchVisible = true
                }
            }
        },
        selectedKeyValue: function (a) {
            if (!a[0]) {
                this.clearSelected()
            } else {
                this.setSelected(a[0].value)
            }

        }
    },
    template: '<div v-bind:style="css_container" class="searchDropDown-container">\
                <select v-emit-change:foo="" v-model="selected" v-bind:id="id" style="display: none">\
                    <option v-for="select in selectedKeyValue" v-bind:value="select.value">\
                        {{select.text}}\
                    </option>\
                </select>\
                <div v-bind:style="css_inputContainer" class="searchDropDown-inputContainer">\
                    <img v-bind:style="css_dropDownIcon" v-on:click="toggleDropDownVisible" v-bind:src="dropDownIcon" class="searchDropDown-dropDownIcon" alt="">\
                    <img v-bind:style="css_clearSearchIcon" v-on:click="clearSearch" v-if="clearSearchVisible" v-bind:src="clearSearchIcon" class="searchDropDown-clearSearchIcon" alt="">\
                    <input v-bind:style="css_searchDropDownInput" v-model="search" v-on:focus="setDropDownVisible(true)" type="text" v-on:keyup="processInputField" class="searchDropDown-input">\
                </div>\
                <div v-bind:style="css_dropDownContainer" class="searchDropDown-dropDownContainer" v-if="dropDownVisible">\
                    <template v-for="item in filterList">\
                        <div :data-value="item.value" v-on:click="itemClicked(item.value)" class="searchDropDown-dropDownItem">{{item.text}}</div>\
                    </template>\
                </div>\
            </div>'
})
Vue.directive('emit-change', function (e) {
    var el = e
    Vue.nextTick(function () {
        $($(el).find('option')[0]).attr('selected',true)
        $(el).trigger('change')
    })
})