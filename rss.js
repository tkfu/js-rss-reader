const DOMPARSER = new DOMParser().parseFromString.bind(new DOMParser())
/* Fetch URLs from JSON */
var hasBegun = true;
var frag = document.createDocumentFragment()
var url = new URL('https://privacy.hypotheses.org/feed')
fetch('https://privacy.hypotheses.org/feed').then((res) => {
	res.text().then((xmlTxt) => {
		/* Parse the RSS Feed and display the content */
			let doc = DOMPARSER(xmlTxt, "text/xml")
			let heading = document.createElement('h1')
			frag.appendChild(heading)
			doc.querySelectorAll('item').forEach((item) => {
				/* Add the tag name of each element as a custom property, because namespaced
				tags (tag names of the form foo:bar) aren't selectable by querySelector. */
				for(var iter=0,els=item.querySelectorAll('*'); iter<els.length;
					els[iter].setAttribute('tagName',els[iter++].tagName) );
				let temp = document.importNode(document.querySelector('template').content, true);
				let i = item.querySelector.bind(item)
				let t = temp.querySelector.bind(temp)
				let preview_image = DOMPARSER(i('[tagName="content\:encoded"]').textContent,"text/html").querySelector('img').src
				t('a').textContent = !!i('title') ? i('title').textContent : '-'
				t('a').href = !!i('link') ? i('link').textContent : '#'
				t('img').src = !!preview_image ? preview_image : '#'
				t('p').innerHTML = !!i('description') ? i('description').textContent : '-'
				t('h3').textContent = i('[tagName="dc\:creator"]').textContent
				frag.appendChild(temp)
			})

		if(hasBegun) {
			document.querySelector('output').textContent = ''; 
			hasBegun = false;
		}
		document.querySelector('output').appendChild(frag)
	})
}).catch(() => console.error('Error in fetching the RSS feed'))
