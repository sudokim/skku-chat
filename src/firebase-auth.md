## Functions

<dl>
<dt><a href="#authSignUp">authSignUp(app_, email_, password_)</a> ⇒ <code>Promise.&lt;(UserCredential|string)&gt;</code></dt>
<dd><p>Sign up for a new account</p>
</dd>
<dt><a href="#authSignIn">authSignIn(app_, email_, password_)</a> ⇒ <code>Promise.&lt;(UserCredential|string)&gt;</code></dt>
<dd><p>Sign in to an account</p>
</dd>
<dt><a href="#authSignInStatus">authSignInStatus(app_)</a> ⇒ <code>boolean</code></dt>
<dd><p>Check if the user is currently signed in</p>
</dd>
<dt><a href="#authSignOut">authSignOut(app_)</a> ⇒ <code>Promise.&lt;(void|string)&gt;</code></dt>
<dd><p>Sign out from the app</p>
</dd>
<dt><a href="#authDeleteUser">authDeleteUser(app_)</a> ⇒ <code>Promise.&lt;(void|string)&gt;</code></dt>
<dd><p>Delete an user
Make sure to confirm the user again!</p>
</dd>
</dl>

<a name="authSignUp"></a>

## authSignUp(app_, email_, password_) ⇒ <code>Promise.&lt;(UserCredential\|string)&gt;</code>
Sign up for a new account

**Kind**: global function  
**Returns**: <code>Promise.&lt;(UserCredential\|string)&gt;</code> - A promise of an UserCredential of the new account, or an error message  

| Param | Type | Description |
| --- | --- | --- |
| app_ |  | Firebase application reference |
| email_ | <code>string</code> | Email address of the user |
| password_ | <code>string</code> | Password of the user |

<a name="authSignIn"></a>

## authSignIn(app_, email_, password_) ⇒ <code>Promise.&lt;(UserCredential\|string)&gt;</code>
Sign in to an account

**Kind**: global function  
**Returns**: <code>Promise.&lt;(UserCredential\|string)&gt;</code> - A promise of an UserCredential, or an error message  

| Param | Description |
| --- | --- |
| app_ | Firebase application reference |
| email_ | Email address |
| password_ | Password |

<a name="authSignInStatus"></a>

## authSignInStatus(app_) ⇒ <code>boolean</code>
Check if the user is currently signed in

**Kind**: global function  
**Returns**: <code>boolean</code> - Boolean value of whether the user is signed in  

| Param | Description |
| --- | --- |
| app_ | Firebase application reference |

<a name="authSignOut"></a>

## authSignOut(app_) ⇒ <code>Promise.&lt;(void\|string)&gt;</code>
Sign out from the app

**Kind**: global function  
**Returns**: <code>Promise.&lt;(void\|string)&gt;</code> - A promise of the result, or an error message  

| Param | Description |
| --- | --- |
| app_ | Firebase application reference |

<a name="authDeleteUser"></a>

## authDeleteUser(app_) ⇒ <code>Promise.&lt;(void\|string)&gt;</code>
Delete an user
Make sure to confirm the user again!

**Kind**: global function  
**Returns**: <code>Promise.&lt;(void\|string)&gt;</code> - A promise for the result, or an error message  

| Param | Description |
| --- | --- |
| app_ | Firebase application reference |

