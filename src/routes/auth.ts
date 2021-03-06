/**
 * @api {get} /authorize Authorization Request
 * @apiName AuthorizationRequest
 * @apiGroup OAuth2
 *
 * @apiParam {string} response_type The authorization endpoint is used by the authorization code grant type and implicit grant type flows
 * @apiParam {string} client_id The client identifier issued to the client during the registration process
 * @apiParam {string} redirect_uri After completing its interaction with the resource owner, the authorization server directs the resource owner's user-agent back to the client
 * @apiParam {string} scope The scope of the access request
 * @apiParam {string} state An opaque value used by the client to maintain state between the request and callback
 *
 */

/**
 * @api {post} /token Access Token Request
 * @apiName AccessTokenRequest
 * @apiGroup OAuth2
 *
 * @apiParam {string} grant_type Grant Type
 * @apiParam {string} client_id The client identifier issued to the client during the registration process
 * @apiParam {string} client_secret The client secret
 * @apiParam {string} redirect_uri After completing its interaction with the resource owner, the authorization server directs the resource owner's user-agent back to the client
 * @apiParam {string} scope The scope of the access request
 * @apiParam {string} code The authorization code generated by the authorization server
 * @apiParam {string} username The username
 * @apiParam {string} password The password
 */

/**
 * @api {post} /validate Validate Request
 * @apiName ValidateRequest
 * @apiGroup OAuth2
 *
 * @apiHeader {string} authorization Bearer Token.
 */

/**
 * @api {get} /user User Request
 * @apiName UserRequest
 * @apiGroup OAuth2
 *
 * @apiHeader {string} authorization Bearer Token.
 */
