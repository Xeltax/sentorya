package com.apigateway.exception

import mu.KotlinLogging
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.context.request.WebRequest
import java.time.LocalDateTime

private val logger = KotlinLogging.logger {}

data class ErrorResponse(
    val success: Boolean = false,
    val error: String,
    val timestamp: LocalDateTime = LocalDateTime.now(),
    val path: String? = null,
    val details: List<String>? = null
)

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException::class)
    fun handleResourceNotFoundException(
        ex: ResourceNotFoundException,
        request: WebRequest
    ): ResponseEntity<ErrorResponse> {
        logger.error { "Resource not found: ${ex.message}" }
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(ErrorResponse(error = ex.message ?: "Resource not found"))
    }

    @ExceptionHandler(BadRequestException::class)
    fun handleBadRequestException(
        ex: BadRequestException,
        request: WebRequest
    ): ResponseEntity<ErrorResponse> {
        logger.error { "Bad request: ${ex.message}" }
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ErrorResponse(error = ex.message ?: "Bad request"))
    }

    @ExceptionHandler(ConflictException::class)
    fun handleConflictException(
        ex: ConflictException,
        request: WebRequest
    ): ResponseEntity<ErrorResponse> {
        logger.error { "Conflict: ${ex.message}" }
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(ErrorResponse(error = ex.message ?: "Conflict"))
    }

    @ExceptionHandler(UnauthorizedException::class)
    fun handleUnauthorizedException(
        ex: UnauthorizedException,
        request: WebRequest
    ): ResponseEntity<ErrorResponse> {
        logger.error { "Unauthorized: ${ex.message}" }
        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(ErrorResponse(error = ex.message ?: "Unauthorized"))
    }

    @ExceptionHandler(ForbiddenException::class)
    fun handleForbiddenException(
        ex: ForbiddenException,
        request: WebRequest
    ): ResponseEntity<ErrorResponse> {
        logger.error { "Forbidden: ${ex.message}" }
        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(ErrorResponse(error = ex.message ?: "Forbidden"))
    }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationException(
        ex: MethodArgumentNotValidException,
        request: WebRequest
    ): ResponseEntity<ErrorResponse> {
        val errors = ex.bindingResult.fieldErrors.map { "${it.field}: ${it.defaultMessage}" }
        logger.error { "Validation error: $errors" }
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ErrorResponse(error = "Validation Error", details = errors))
    }

    @ExceptionHandler(Exception::class)
    fun handleGenericException(
        ex: Exception,
        request: WebRequest
    ): ResponseEntity<ErrorResponse> {
        logger.error(ex) { "Internal server error: ${ex.message}" }
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ErrorResponse(error = ex.message ?: "Internal server error"))
    }
}
