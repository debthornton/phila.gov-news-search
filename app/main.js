const ul = document.querySelector('ul');
let form = document.querySelector('form');

// phila.gov API endpoint
let api = `https://www.phila.gov/wp-json/wp/v2/posts/?per_page=20`;

const fetchFunction = (userInput) => {
    // Retrieve API data
    fetch(api)
        .then((response) => {   
            return response.json();
        })
        .then((data) => {
            // format JSON date to be more readable
            const dateFormatter = postDate => {
                let dateData = postDate;

                // remove all string characters that are not apart of the basic date
                const dateDataLength = 10;
                const date = dateData.substring(0, dateDataLength); 

                // initialize a day, month, and year variable containing the matching strings
                let day = date.substring(8,10);
                let month = date.substring(5,7);
                let year = date.substring(0, 4);


                // remove '0' from all day strings starting with '0'
                if (day.substring(0,1) == '0') {
                    day = day.substring(1,2);
                }

                // match each given year string with the appropriate abbreviated month
                switch(month) {
                    case '01':
                        month = 'Jan.';
                        break;
                    case '02':
                        month = 'Feb.';
                        break;
                    case '03':
                        month = 'Mar.';
                        break;
                    case '04':
                        month = 'Apr.';
                        break;
                    case '05':
                        month = 'May';
                        break;
                    case '06':
                        month = 'Jun.';
                        break;
                    case '07':
                        month = 'Jul.';
                        break;
                    case '08':
                        month = 'Aug.';
                        break;
                    case '09':
                        month = 'Sep.';
                        break;
                    case '10':
                        month = 'Oct.';
                        break;
                    case '11':
                        month = 'Nov.';
                        break;
                    default:
                        month = 'Dec.';                       
                }

                // place newly formatted strings into a variable
                let formattedDate = `${month} ${day}, ${year}`;
                return formattedDate;                  
            }

            // remove all li elements before adding new ones
            const resetPosts = () => {
                let liArr = [...ul.querySelectorAll('li')];
                liArr.forEach(post => post.remove());
            }

            (() => {
                // call resetPosts() only if posts have been previously rendered
                if(ul.children.length > 0) {
                    resetPosts();
                }

                // initialize a counter for matched user input / post titles
                let counter = 0;

                // Create a new li element parent with div and p children for each post on initial load
                data.forEach(post => {
                        let reg = new RegExp(`${userInput}`, "i");
                        let postTitle = post.title.rendered;

                        if((reg.test(postTitle)) || (userInput === '')) {
                            const li = document.createElement('li');
                            const link = document.createElement('a');
                            const p = document.createElement('p');
                            p.className = 'title';
                            const div = document.createElement('div');                 

                            // set each anchor tag's reference link
                            link.setAttribute('href', `${post.link}`);
                            link.setAttribute('target', '_blank');
        
                            // set each p text content with title
                            p.textContent = postTitle;
                                               
                            // set formatted date
                            div.textContent = dateFormatter(post.date);
                            
                            //assemble elements
                            ul.append(li);
                            li.append(link);
                            link.append(p);
                            li.append(div);

                            // keep a count of matched results
                            counter++;
                        }                         
                });

                // maintain accessibility with tabIndex
                let displayedLi = [...ul.querySelectorAll('li')];
                let tabIndex = 6;
                displayedLi.forEach(post => {
                    post.setAttribute('tabIndex', `${tabIndex}`);
                    tabIndex++;
                    console.log(tabIndex);
                })

                // if number of matched results only represents inital empty string, clear list and display message
                if (counter < 2) {
                    resetPosts();
                    const li = document.createElement('li');
                    const p = document.createElement('p');
                    p.textContent = 'Match not found.';
                    ul.append(li);
                    li.append(p);
                }
            })();
        });
}

// call the api on page load
window.addEventListener('load', ()=> {    
    fetchFunction('');
});

// call the api on submit using the user's input
form.addEventListener('submit', (e)=> {
    let input = document.querySelector('input').value;
    e.preventDefault();
    api = `https://www.phila.gov/wp-json/wp/v2/posts/?per_page=20&title=${input}`;    
    fetchFunction(input);
});