## Functions

<dl>
<dt><a href="#storageUpload">storageUpload(app_, src, dest)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Upload a file to the storage</p>
<p>Usage: <code>storageUpload(app, &quot;file://cat.jpg&quot;, &quot;images/room_1/img_1.jpg&quot;).then((r) =&gt; alert(&quot;File uploaded to: &quot; + r))</code></p>
</dd>
<dt><a href="#storageDelete">storageDelete(app_, file)</a> ⇒ <code>Promise.&lt;(void|string)&gt;</code></dt>
<dd><p>Delete a file from the storage</p>
<p>Usage: <code>storageDelete(app, &quot;images/room_1/img_1.jpg&quot;).then(() =&gt; alert(&quot;File deleted&quot;))</code></p>
</dd>
<dt><a href="#storageView">storageView(app_, dir)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>View a list of files from the directory</p>
<p>Usage: <code>storageView(app, &quot;images/room_1/&quot;).then((files) =&gt; files.forEach((file) =&gt; addFileListView(file))</code></p>
</dd>
<dt><a href="#storageGetURL">storageGetURL(app_, file)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Get an URL for the file</p>
<p>Usage: <code>storageGetURL(app, &quot;images/room_1/cat.jpg&quot;).then((img) =&gt; image.src = img)</code></p>
</dd>
</dl>

<a name="storageUpload"></a>

## storageUpload(app_, src, dest) ⇒ <code>Promise.&lt;string&gt;</code>
Upload a file to the storage

Usage: `storageUpload(app, "file://cat.jpg", "images/room_1/img_1.jpg").then((r) => alert("File uploaded to: " + r))`

**Kind**: global function  
**Returns**: <code>Promise.&lt;string&gt;</code> - Returns a promise for the path of the uploaded file of whether the upload was successful,
or an error message if not successful  

| Param | Type | Description |
| --- | --- | --- |
| app_ |  | Firebase application reference |
| src | <code>string</code> | Source path of the file |
| dest | <code>string</code> | Destination path of the file |

<a name="storageDelete"></a>

## storageDelete(app_, file) ⇒ <code>Promise.&lt;(void\|string)&gt;</code>
Delete a file from the storage

Usage: `storageDelete(app, "images/room_1/img_1.jpg").then(() => alert("File deleted"))`

**Kind**: global function  
**Returns**: <code>Promise.&lt;(void\|string)&gt;</code> - Returns a promise of whether deleting the file was successful,
or an error message if not successful  

| Param | Description |
| --- | --- |
| app_ | Firebase application reference |
| file | Path of the file to be deleted |

<a name="storageView"></a>

## storageView(app_, dir) ⇒ <code>Promise.&lt;string&gt;</code>
View a list of files from the directory

Usage: `storageView(app, "images/room_1/").then((files) => files.forEach((file) => addFileListView(file))`

**Kind**: global function  
**Returns**: <code>Promise.&lt;string&gt;</code> - A promise of a string representation of the list of the files if the directory exists,
or an error message if not successful  

| Param | Description |
| --- | --- |
| app_ | Firebase application reference |
| dir | Path of the directory |

<a name="storageGetURL"></a>

## storageGetURL(app_, file) ⇒ <code>Promise.&lt;string&gt;</code>
Get an URL for the file

Usage: `storageGetURL(app, "images/room_1/cat.jpg").then((img) => image.src = img)`

**Kind**: global function  
**Returns**: <code>Promise.&lt;string&gt;</code> - A promise of an URL  

| Param | Description |
| --- | --- |
| app_ | Firebase application reference |
| file | Path to file |

