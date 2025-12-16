package com.apigateway.gophish.exception

/**
 * Exception de base pour toutes les erreurs liées à GoPhish
 */
open class GoPhishException(message: String, cause: Throwable? = null) : RuntimeException(message, cause)

/**
 * Exception levée lorsque l'API GoPhish retourne une erreur
 */
class GoPhishApiException(message: String, val statusCode: Int? = null, cause: Throwable? = null) :
    GoPhishException("Erreur API GoPhish: $message (Status: $statusCode)", cause)

/**
 * Exception levée lorsque GoPhish n'est pas accessible
 */
class GoPhishConnectionException(message: String, cause: Throwable? = null) :
    GoPhishException("Impossible de se connecter à GoPhish: $message", cause)

/**
 * Exception levée lorsqu'une ressource n'est pas trouvée dans GoPhish
 */
class GoPhishNotFoundException(resourceType: String, identifier: String) :
    GoPhishException("$resourceType non trouvé dans GoPhish: $identifier")

/**
 * Exception levée lorsqu'il y a un conflit (ressource déjà existante, etc.)
 */
class GoPhishConflictException(message: String) :
    GoPhishException("Conflit GoPhish: $message")

/**
 * Exception levée lorsque l'authentification échoue
 */
class GoPhishAuthenticationException(message: String = "Authentification GoPhish échouée") :
    GoPhishException(message)