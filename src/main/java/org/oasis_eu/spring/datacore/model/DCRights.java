package org.oasis_eu.spring.datacore.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

/**
 * User: flombard
 * Date: 24/2/14
 */
public class DCRights {

    private List<String> owners;
    private List<String> writers;
    private List<String> readers;

    public List<String> getOwners() {
        return owners;
    }
    public void setOwners(List<String> owners) {
        this.owners = owners;
    }

    public void addOwners(List<String> owners) {
        //Filter repeated values
        Set<String> rights = new TreeSet<>(owners);
        //rights.addAll(this.owners);
        this.owners.addAll(new ArrayList<String>(rights));
    }

    public List<String> getWriters() {
        return writers;
    }
    public void setWriters(List<String> writers) {
        this.writers = writers;
    }

    public List<String> getReaders() {
        return readers;
    }
    public void setReaders(List<String> readers) {
        this.readers = readers;
    }

}
