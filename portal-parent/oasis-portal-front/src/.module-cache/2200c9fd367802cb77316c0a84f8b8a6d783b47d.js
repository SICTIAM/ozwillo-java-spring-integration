var converter = new Showdown.converter({extensions: ["table"]}), AppStore = React.createClass({
    displayName: "AppStore",
    componentDidMount: function () {
        this.updateApps(!0, !0, !0, !0, !0)
    },
    getInitialState: function () {
        return {
            apps: [],
            loading: !0,
            maybeMoreApps: !1,
            filter: {audience: {citizens: !0, publicbodies: !0, companies: !0}, payment: {paid: !0, free: !0}}
        }
    },
    updateApps: function (target_citizens, target_publicbodies, target_companies, paid, free) {
        $.ajax({
            url: store_service + "/applications",
            data: {
                target_citizens: target_citizens,
                target_publicbodies: target_publicbodies,
                target_companies: target_companies,
                free: free,
                paid: paid
            },
            type: "get",
            dataType: "json",
            success: function (data) {
                this.setState({
                    apps: data.apps,
                    maybeMoreApps: data.maybeMoreApps,
                    loading: !1,
                    filter: {
                        audience: {
                            citizens: target_citizens,
                            publicbodies: target_publicbodies,
                            companies: target_companies
                        }, payment: {free: free, paid: paid}
                    }
                })
            }.bind(this),
            error: function (xhr, status, err) {
                this.setState({apps: [], loading: !1})
            }.bind(this)
        })
    },
    loadMoreApps: function () {
        var state = this.state;
        state.loading = !0, this.setState(state), $.ajax({
            url: store_service + "/applications",
            data: {
                last: this.state.apps.length,
                target_citizens: this.state.filter.audience.citizens,
                target_publicbodies: this.state.filter.audience.publicbodies,
                target_companies: this.state.filter.audience.companies,
                free: this.state.filter.payment.free,
                paid: this.state.filter.payment.paid
            },
            type: "get",
            dataType: "json",
            success: function (data) {
                var state = this.state;
                state.apps = state.apps.concat(data.apps), state.loading = !1, state.maybeMoreApps = data.maybeMoreApps, this.setState(state)
            }.bind(this),
            error: function () {
                var state = this.state;
                state.loading = !1, state.maybeMoreApps = !1, this.setState(state)
            }.bind(this)
        })
    },
    render: function () {
        return React.DOM.div(null, React.DOM.div({className: "row"}, SideBar({
            updateApps: this.updateApps,
            filter: this.state.filter
        }), AppList({apps: this.state.apps})), React.DOM.div({className: "row"}, LoadMore({
            loading: this.state.loading,
            maybeMoreApps: this.state.maybeMoreApps,
            loadMoreApps: this.loadMoreApps
        })))
    }
}), SideBar = React.createClass({
    displayName: "SideBar", change: function (category, item) {
        return function () {
            var canChange = !1;
            for (var i in this.props.filter[category])if (i != item && 1 == this.props.filter[category][i]) {
                canChange = !0;
                break
            }
            if (canChange) {
                var filter = this.props.filter;
                filter[category][item] = !filter[category][item], this.props.updateApps(filter.audience.citizens, filter.audience.publicbodies, filter.audience.companies, filter.payment.paid, filter.payment.free)
            }
        }.bind(this)
    }, render: function () {
        return React.DOM.div({className: "col-md-4"}, React.DOM.h2(null, React.DOM.img({src: image_root + "my/app-store.png"}), " ", t("ui.appstore")), React.DOM.div({className: "checkbox"}, React.DOM.label(null, React.DOM.input({
            type: "checkbox",
            checked: this.props.filter.audience.citizens,
            onChange: this.change("audience", "citizens")
        }), t("citizens"))), React.DOM.div({className: "checkbox"}, React.DOM.label(null, React.DOM.input({
            type: "checkbox",
            checked: this.props.filter.audience.publicbodies,
            onChange: this.change("audience", "publicbodies")
        }), t("publicbodies"))), React.DOM.div({className: "checkbox"}, React.DOM.label(null, React.DOM.input({
            type: "checkbox",
            checked: this.props.filter.audience.companies,
            onChange: this.change("audience", "companies")
        }), t("companies"))), React.DOM.div(null), React.DOM.div({className: "checkbox"}, React.DOM.label(null, React.DOM.input({
            type: "checkbox",
            checked: this.props.filter.payment.free,
            onChange: this.change("payment", "free")
        }), t("free"))), React.DOM.div({className: "checkbox"}, React.DOM.label(null, React.DOM.input({
            type: "checkbox",
            checked: this.props.filter.payment.paid,
            onChange: this.change("payment", "paid")
        }), t("paid"))))
    }
}), AppList = React.createClass({
    displayName: "AppList", render: function () {
        var apps = this.props.apps.map(function (app) {
            return App({key: app.id, app: app})
        });
        return React.DOM.div({className: "col-md-8 app-store-result"}, apps)
    }
}), LoadMore = React.createClass({
    displayName: "LoadMore", render: function () {
        var loading = null;
        return this.props.loading ? loading = React.DOM.div({className: "text-center"}, React.DOM.i({className: "fa fa-spinner fa-spin"}), " ", t("ui.loading")) : this.props.maybeMoreApps && (loading = React.DOM.div({className: "text-center"}, React.DOM.button({
            className: "btn btn-primary",
            onClick: this.props.loadMoreApps
        }, "Load more"))), React.DOM.div({className: "col-md-8 col-md-offset-4"}, loading)
    }
}), App = React.createClass({
    displayName: "App", componentDidMount: function () {
        default_app && default_app.type == this.props.app.type && default_app.id == this.props.app.id && this.openApp()
    }, openApp: function () {
        this.refs.appmodal.open()
    }, render: function () {
        var indicatorStatus = this.props.app.installed ? "installed" : this.props.app.paid ? "paid" : "free", pubServiceIndicator = this.props.app.public_service ? React.DOM.div({className: "public-service-indicator"}, React.DOM.div({className: "triangle"}), React.DOM.div({className: "label"}, React.DOM.i({className: "triangle fa fa-institution"}))) : null;
        return React.DOM.div(null, AppModal({
            ref: "appmodal",
            app: this.props.app
        }), React.DOM.div({
            className: "hit text-center",
            onClick: this.openApp
        }, pubServiceIndicator, React.DOM.img({src: this.props.app.icon}), React.DOM.p({className: "appname"}, this.props.app.name), React.DOM.div({className: "caption"}, React.DOM.p(null, this.props.app.provider), React.DOM.p({className: "appdescription"}, this.props.app.description)), Indicator({status: indicatorStatus})))
    }
}), Indicator = React.createClass({
    displayName: "Indicator", render: function () {
        var btns, status = this.props.status;
        return btns = "installed" == status ? [React.DOM.button({
            key: "indicator_button",
            className: "btn btn-indicator btn-indicator-installed"
        }, t("installed")), React.DOM.button({
            key: "indicator_icon",
            className: "btn btn-indicator btn-indicator-installed-icon"
        }, React.DOM.i({className: "fa fa-check"}))] : "free" == status ? [React.DOM.button({
            key: "indication_button",
            className: "btn btn-indicator btn-indicator-available"
        }, t("free"))] : [React.DOM.button({
            key: "indicator_button",
            className: "btn btn-indicator btn-indicator-available"
        }, t("paid")), React.DOM.button({
            key: "indicator_icon",
            className: "btn btn-indicator btn-indicator-available-icon"
        }, React.DOM.i({className: "fa fa-eur"}))], React.DOM.div({className: "btn-group indicator"}, btns)
    }
}), AppModal = React.createClass({
    displayName: "AppModal", getInitialState: function () {
        return {
            app: {rating: 0, rateable: !0, tos: "", policy: "", longdescription: "", screenshots: null},
            orgs: [],
            createOrg: !1,
            buying: !1,
            error: !1
        }
    }, componentDidMount: function () {
        $(this.refs.modal.getDOMNode()).on("hide.bs.modal", function () {
            history.pushState({}, "store", store_root)
        })
    }, loadApp: function () {
        $.ajax({
            url: store_service + "/details/" + this.props.app.type + "/" + this.props.app.id,
            type: "get",
            dataType: "json",
            success: function (data) {
                var state = this.state;
                state.app = data, this.setState(state)
            }.bind(this),
            error: function (xhr, status, err) {
            }.bind(this)
        })
    }, loadOrgs: function () {
        $.ajax({
            url: store_service + "/organizations/" + this.props.app.id,
            type: "get",
            dataType: "json",
            success: function (data) {
                var state = this.state;
                state.orgs = data, this.setState(state)
            }.bind(this),
            error: function (xhr, status, err) {
            }.bind(this)
        })
    }, open: function () {
        this.setState(this.getInitialState());
        var href = store_root + "/" + this.props.app.type + "/" + this.props.app.id;
        "function" == typeof history.pushState && history.pushState({}, "application", href), this.loadApp(), logged_in && this.loadOrgs(), this.refs.modal.open()
    }, installApp: function (organization) {
        var state = this.state;
        state.buying = !0, this.setState(state);
        var request = {appId: this.props.app.id, appType: this.props.app.type};
        organization && (request.organizationId = organization), $.ajax({
            url: store_service + "/buy",
            type: "post",
            data: JSON.stringify(request),
            contentType: "application/json",
            success: function (data) {
                if (data.success)window.location = "/my/dashboard"; else {
                    var state = this.state;
                    state.buying = !1, state.error = !0, this.setState(state)
                }
            }.bind(this),
            error: function (xhr, status, err) {
                var state = this.state;
                state.buying = !1, this.setState(state)
            }.bind(this)
        })
    }, createNewOrg: function () {
        var state = this.state;
        state.createOrg = !0, this.setState(state)
    }, orgCreated: function (org) {
        var state = this.state;
        state.createOrg = !1, org && this.installApp(org.id), this.setState(state)
    }, doCreateOrg: function () {
        this.refs.createOrgForm && this.refs.createOrgForm.saveOrganization()
    }, cancelCreateOrg: function () {
        var state = this.state;
        state.createOrg = !1, this.setState(state)
    }, rateApp: function (rate) {
        $.ajax({
            url: store_service + "/rate/" + this.props.app.type + "/" + this.props.app.id,
            type: "post",
            contentType: "application/json",
            data: JSON.stringify({rate: rate}),
            success: function () {
                var state = this.state;
                state.app.rateable = !1, state.app.rating = rate, this.setState(state)
            }.bind(this),
            error: function (xhr, status, err) {
            }.bind(this)
        })
    }, componentDidUpdate: function () {
        var desc = $(this.getDOMNode()).find(".app-description table");
        desc.addClass("table table-bordered table-condensed table-striped")
    }, renderAppDescription: function () {
        var rateInfo, carousel = this.state.app.screenshots && this.state.app.screenshots.length > 0 ? React.DOM.div({className: "row"}, Carousel({images: this.state.app.screenshots})) : null, error = this.state.error ? React.DOM.div({
            className: "alert alert-danger alert-dismissible",
            role: "alert"
        }, React.DOM.button({
            type: "button",
            className: "close",
            "data-dismiss": "alert"
        }, React.DOM.span({"aria-hidden": "true"}, "×"), React.DOM.span({className: "sr-only"}, t("ui.close"))), React.DOM.strong(null, t("sorry")), " ", t("could-not-install-app")) : null;
        rateInfo = logged_in ? this.state.app.rateable ? null : React.DOM.p(null, t("already-rated")) : null;
        var description = converter.makeHtml(this.state.app.longdescription);
        return React.DOM.div(null, React.DOM.div({className: "row"}, React.DOM.div({className: "col-sm-1"}, React.DOM.img({
            src: this.props.app.icon,
            alt: this.props.app.name
        })), React.DOM.div({className: "col-sm-7"}, React.DOM.div(null, React.DOM.p({className: "appname"}, this.props.app.name), React.DOM.p(null, t("by"), " ", this.props.app.provider))), React.DOM.div({className: "col-sm-4 center-container install-application"}, InstallButton({
            app: this.props.app,
            orgs: this.state.orgs,
            url: this.state.app.serviceUrl,
            installApp: this.installApp,
            createNewOrg: this.createNewOrg
        }))), React.DOM.div({className: "row"}, Rating({
            rating: this.state.app.rating,
            rateable: this.state.app.rateable,
            rate: this.rateApp
        }), rateInfo), error, carousel, React.DOM.div({className: "row"}, React.DOM.div({
            className: "col-md-6 app-description",
            dangerouslySetInnerHTML: {__html: description}
        }), React.DOM.div({className: "col-md-6"}, React.DOM.p(null, t("agree-to-tos")), React.DOM.p(null, React.DOM.a({
            href: this.state.app.tos,
            target: "_new"
        }, t("tos"))), React.DOM.p(null, React.DOM.a({href: this.state.app.policy, target: "_new"}, t("privacy"))))))
    }, orgTypeRestriction: function () {
        return {company: this.props.app.target_companies, public_body: this.props.app.target_publicbodies}
    }, renderCreateNew: function () {
        return React.DOM.div(null, React.DOM.h3(null, t("create-new-org")), CreateOrganizationForm({
            ref: "createOrgForm",
            successHandler: this.orgCreated,
            typeRestriction: this.orgTypeRestriction()
        }), React.DOM.div({className: "row"}, React.DOM.div({className: "col-sm-4 col-sm-offset-8"}, React.DOM.a({
            className: "btn btn-default",
            onClick: this.cancelCreateOrg
        }, t("ui.cancel")), React.DOM.a({className: "btn btn-primary", onClick: this.doCreateOrg}, t("create")))))
    }, renderBuying: function () {
        return React.DOM.h3(null, React.DOM.i({className: "fa fa-spinner fa-spin"}), " ", t("buying"))
    }, render: function () {
        var content = null;
        return content = this.state.buying ? this.renderBuying() : this.state.createOrg ? this.renderCreateNew() : this.renderAppDescription(), Modal({
            ref: "modal",
            large: !0,
            infobox: !0,
            title: this.props.app.name
        }, content)
    }
}), InstallButton = React.createClass({
    displayName: "InstallButton", onlyForCitizens: function () {
        return this.props.app.target_citizens && !this.props.app.target_companies && !this.props.app.target_publicbodies
    }, hasCitizens: function () {
        return this.props.app.target_citizens
    }, componentDidMount: function () {
        this.onlyForCitizens() || ($("#install").popover({
            content: $("#install-app-popover").html(),
            html: !0,
            placement: "bottom",
            trigger: "click"
        }), $(this.getDOMNode()).find("button[data-toggle='dropdown']").dropdown())
    }, installApp: function (event) {
        event.preventDefault(), this.props.installApp()
    }, installAppForOrganization: function (orgId) {
        return function (event) {
            event.preventDefault(), this.props.installApp(orgId)
        }.bind(this)
    }, render: function () {
        if (logged_in) {
            if ("service" == this.props.app.type)return this.props.app.installed ? this.props.url ? React.DOM.a({
                className: "btn btn-primary",
                href: this.props.url,
                target: "_new"
            }, t("launch")) : React.DOM.a({className: "btn btn-primary"}, React.DOM.i({className: "fa fa-spinner fa-spin"})) : React.DOM.a({
                className: "btn btn-primary",
                href: "#",
                onClick: this.installApp
            }, t("install"));
            var installForSelf = null;
            this.hasCitizens() && (installForSelf = React.DOM.button({
                type: "button",
                className: "btn btn-default",
                onClick: this.installApp
            }, t("for_myself")));
            var installOnBehalf = null;
            if (!this.onlyForCitizens()) {
                var organizations = this.props.orgs.map(function (org) {
                    return React.DOM.li({key: org.id}, React.DOM.a({
                        href: "#",
                        onClick: this.installAppForOrganization(org.id)
                    }, org.name))
                }.bind(this));
                installOnBehalf = [React.DOM.button({
                    key: "behalfButton",
                    type: "button",
                    className: "btn btn-default",
                    "data-toggle": "dropdown"
                }, t("on_behalf_of"), React.DOM.span({className: "caret"})), React.DOM.ul({
                    key: "behalfMenu",
                    className: "dropdown-menu",
                    role: "menu"
                }, organizations, React.DOM.li(null, React.DOM.a({
                    href: "#",
                    onClick: this.props.createNewOrg
                }, t("create-new-org"))))]
            }
            return MyPop({
                className: "btn btn-primary",
                label: t("install")
            }, React.DOM.div({className: "row"}, React.DOM.div({className: "col-sm-2"}, React.DOM.img({src: image_root + "my/app-store.png"})), React.DOM.div({className: "col-sm-10"}, React.DOM.h4(null, t("install_this_app")), React.DOM.p(null, t("confirm-install-this-app")), this.props.app.paid ? React.DOM.p(null, t("confirm-install-this-app-paid")) : null, installForSelf, installOnBehalf)))
        }
        return React.DOM.a({
            className: "btn btn-primary-inverse",
            href: store_root + "/login?appId=" + this.props.app.id + "&appType=" + this.props.app.type
        }, t("install"))
    }
}), Carousel = React.createClass({
    displayName: "Carousel", getInitialState: function () {
        return {index: 0}
    }, back: function () {
        var index = this.state.index;
        index = Math.max(0, index - 1), this.setState({index: index})
    }, forward: function () {
        var index = this.state.index;
        index = Math.min(this.props.images.length, index + 1), this.setState({index: index})
    }, render: function () {
        if (!this.props.images)return null;
        var back = null;
        this.state.index > 0 && (back = React.DOM.a({
            className: "back",
            onClick: this.back
        }, React.DOM.i({className: "fa fa-chevron-left"})));
        var forward = null;
        return this.state.index < this.props.images.length - 1 && (forward = React.DOM.a({
            className: "forward",
            onClick: this.forward
        }, React.DOM.i({className: "fa fa-chevron-right"}))), React.DOM.div({className: "carousel"}, back, React.DOM.img({
            src: this.props.images[this.state.index],
            alt: this.state.index
        }), forward)
    }
}), Rating = React.createClass({
    displayName: "Rating", getInitialState: function () {
        return {}
    }, startEditing: function () {
        this.props.rateable && this.setState({editing: !0, rating: 0})
    }, stopEditing: function () {
        this.setState({editing: !1, rating: 0})
    }, rate: function () {
        this.props.rateable && this.props.rate(this.state.rating)
    }, mouseMove: function (event) {
        if (this.state.editing) {
            var rect = this.getDOMNode().getBoundingClientRect(), x = Math.floor(8 * (event.clientX - rect.left) / rect.width) / 2;
            rect.right - event.clientX < 5 && (x = 4), this.setState({editing: !0, rating: x})
        }
    }, render: function () {
        var className, rating;
        rating = this.state.editing ? this.state.rating : this.props.rating;
        var rt = 1 > rating ? "0" + 10 * rating : 10 * rating;
        return className = "rating-static rating-" + rt, React.DOM.div({
            className: className,
            onMouseEnter: this.startEditing,
            onMouseLeave: this.stopEditing,
            onMouseMove: this.mouseMove,
            onClick: this.rate
        })
    }
});
React.renderComponent(AppStore(null), document.getElementById("store"));