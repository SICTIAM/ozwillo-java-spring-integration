package org.oasis_eu.portal.front.generic;

import java.util.Locale;

import javax.servlet.http.HttpServletRequest;

import org.oasis_eu.portal.core.controller.Languages;
import org.oasis_eu.spring.kernel.model.UserInfo;
import org.oasis_eu.spring.kernel.service.UserInfoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.support.RequestContextUtils;

/**
 * User: schambon Date: 6/11/14
 */
abstract public class PortalController {

    private final Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private UserInfoService userInfoService;

	@Autowired
	private HttpServletRequest request;

	@ModelAttribute("languages")
	public Languages[] languages() {
		return Languages.values();
	}

	@ModelAttribute("currentLanguage")
	public Languages currentLanguage() {
		Locale currentLocale = RequestContextUtils.getLocale(request);
		return Languages.getByLocale(currentLocale, Languages.ENGLISH);
	}

	@ModelAttribute("user")
	public UserInfo user() {
		return userInfoService.currentUser();
	}


    @ExceptionHandler
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public String handleErrors(Exception e) {
        logger.warn("Caught exception while processing request", e);
        return "error";
    }
}