package org.oasis_eu.spring.kernel.dao.impl;

import org.joda.time.Instant;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.oasis_eu.spring.kernel.dao.DAOTestConfiguration;
import org.oasis_eu.spring.kernel.security.OpenIdCAuthentication;
import org.oasis_eu.spring.kernel.service.OrganizationStore;
import org.oasis_eu.spring.kernel.model.Organization;
import org.oasis_eu.spring.test.IntegrationTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;


@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes=DAOTestConfiguration.class, loader = AnnotationConfigContextLoader.class)
@DirtiesContext
public class OrganizationStoreImplTest {

    @Autowired
    private OrganizationStore store;

    @Autowired
    private RestTemplate kernelRestTemplate;

    private static final String RESPONSE = "{\n" +
            "  \"id\": \"6dccdb8d-ec46-4675-9965-806ea37b73e1\",\n" +
            "  \"name\": \"openwide-ck\",\n" +
            "  \"modified\": 1386859649613\n" +
            "}";

    @Test
    public void testFind() {

        OpenIdCAuthentication authentication = new OpenIdCAuthentication("test", "accesstoken", "idtoken", java.time.Instant.now(), java.time.Instant.now());
        SecurityContextHolder.setContext(SecurityContextHolder.createEmptyContext());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        MockRestServiceServer server = MockRestServiceServer.createServer(kernelRestTemplate);
        server.expect(requestTo("https://oasis-demo.atolcd.com/d/org/6dccdb8d-ec46-4675-9965-806ea37b73e1"))
        .andExpect(method(HttpMethod.GET))
        .andRespond(withSuccess(RESPONSE, MediaType.APPLICATION_JSON));

        Organization openwide = store.find("6dccdb8d-ec46-4675-9965-806ea37b73e1");
        assertEquals("openwide-ck", openwide.getName());
        assertEquals(new Instant(1386859649613l), openwide.getModified());

        server.verify();
    }
}