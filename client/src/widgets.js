// @flow
/* eslint eqeqeq: "off" */

import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import { Job } from './services';

function formatTime(dateTime: string) {
    return dateTime.split(':')[0] + ':' + dateTime.split(':')[1];
}

//config variables:
let jobsPrPage: number = 4;

function getJobPage(jobs: Array<Job>, page: number) {
    return jobs.filter((job, indx) => (page - 1) * jobsPrPage <= indx && indx < jobsPrPage * page);
}

function formatPreviewStr(content: string) {
    let contentArray = content.split('.');

    if (contentArray.length > 1) {
        return contentArray[0] + ' ...';
    } else {
        return contentArray[0];
    }
}

/**
 * Renders alert messages using Bootstrap classes.
 */
export class Alert extends Component {
    alerts: { id: number, text: React.Node, type: string }[] = [];
    static nextId = 0;

    render() {
        return (
            <>
                {this.alerts.filter(alert => alert.id >= Alert.nextId - 2)
                    .map((alert, i) => (
                    <div key={alert.id} className={'alert alert-' + alert.type} role="alert">
                        {alert.text}
                        <button
                            type="button"
                            className="close"
                            onClick={() => {
                                this.alerts.splice(i, 1);
                            }}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </>
        );
    }

    static success(text: React.Node) {
        // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
        setTimeout(() => {
            for (let instance of Alert.instances())
                instance.alerts.push({ id: Alert.nextId++, text: text, type: 'success' });
        });
    }

    static info(text: React.Node) {
        // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
        setTimeout(() => {
            for (let instance of Alert.instances())
                instance.alerts.push({ id: Alert.nextId++, text: text, type: 'info' });
        });
    }

    static warning(text: React.Node) {
        // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
        setTimeout(() => {
            for (let instance of Alert.instances())
                instance.alerts.push({ id: Alert.nextId++, text: text, type: 'warning' });
        });
    }

    static danger(text: React.Node) {
        // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
        setTimeout(() => {
            for (let instance of Alert.instances())
                instance.alerts.push({ id: Alert.nextId++, text: text, type: 'danger' });
        });
    }
}

class NavBarLink extends Component<{ exact?: boolean, to: string, children?: React.Node }> {
    render() {
        return (
            <NavLink className="nav-link" activeClassName="active" exact={this.props.exact} to={this.props.to}>
                {this.props.children}
            </NavLink>
        );
    }
}

/**
 * Renders a navigation bar using Bootstrap classes
 */
export class NavBar extends Component<{ brand?: React.Node, children?: React.Node }> {
    static Link = NavBarLink;

    render() {
        return (
            <nav className="navbar navbar-expand-lg bg-light navbar-light mb-3">
                {
                    <NavLink className="navbar-brand" activeClassName="active" exact to="/">
                        {this.props.brand}
                    </NavLink>
                }
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav">{this.props.children}</ul>
                    <ul className={'navbar-nav ml-auto'}>
                        <NavSearch />
                    </ul>
                </div>
            </nav>
        );
    }
}

type Props = {
    //Nødvendig for å unngå flow feil..
};
type State = {
    keyword: string
};

export class NavSearch extends Component<Props, State> {
    state = {
        keyword: ''
    };

    render() {
        return (
            <ul className={'ml-100'}>
                <li>
                    <form className="form-inline my-2 my-lg-0">
                        <input
                            className="form-control mr-sm-2"
                            type="search"
                            placeholder="Søk"
                            id={'searchInput'}
                            aria-label="Søk"
                            onChange={(event: SyntheticInputEvent<HTMLInputElement>) =>
                                this.setState({ keyword: event.target.value })
                            }
                        ></input>
                        <button
                            className="btn btn-outline-info my-2 my-sm-0"
                            type="submit"
                            onClick={() => (window.location = '/#/search/' + this.state.keyword)}
                        >
                            Søk
                        </button>
                    </form>
                </li>
            </ul>
        );
    }
}

export class Filters extends Component<{}> {
    render() {
        return (
            <div>
                <div className="card pl-5 pb-4 pt-3 mt-5 shadow-sm">
                    <div className="row">
                        <h3>Filtere:</h3>
                    </div>
                    <div className="pt-2 row">
                        <p>Typer arbeid:</p>
                    </div>
                    <div className="row">
                        <input className="col-1" type="checkbox" />
                        <p>Transport</p>
                    </div>
                    <div className="row">
                        <input className="col-1" type="checkbox" />
                        <p>Håndtverk</p>
                    </div>
                    <div className="row">
                        <input className="col-1" type="checkbox" />
                        <p>Diverse</p>
                    </div>

                    <div className="row">
                        <button
                            onClick={() => Alert.danger('Denne funkjsonen er kun for design')}
                            className="btn btn-dark"
                        >
                            Søk
                        </button>
                    </div>
                </div>

                <div className="row">
                    <div className="ml-3 mt-5 pb-5">
                        <NavLink exact to={'/newjob'}>
                            <button className=" btn btn-info">Legg ut ny jobb</button>
                        </NavLink>
                    </div>
                </div>
            </div>
        );
    }
}

export class MessageInfo extends Component<{ message: string, from: string, dateTime: string, id: number }> {
    render() {
        return (
            <li key={this.props.id}>
                <Card title={this.props.from}>
                    <Row>
                        <Column>
                            <p>{this.props.message}</p>
                        </Column>
                    </Row>
                    <Row>
                        <Column>
                            <p className={'font-weight-light'}>
                                <i>{this.props.dateTime}</i>
                            </p>
                        </Column>
                    </Row>
                </Card>
            </li>
        );
    }
}

export class CarouselItem extends Component<{ title: string, dateTime: string, id: number, indx: number }> {
    carouselItemClass = 'carousel-item';

    render() {
        if (this.props.indx == 0) this.carouselItemClass += ' active';
        return (
            <div key={this.props.id} className="carousel-item active">
                <div className="d-flex h-100 align-items-center justify-content-center">
                    <NavLink to={'/jobs/' + this.props.id}>
                        <p>{this.props.title}</p>
                        <p>{this.props.dateTime}</p>
                    </NavLink>
                </div>
            </div>
        );
    }
}

export class Pages extends Component<{ jobs: Array<Job>, onClick: number => mixed }> {
    currentPage: number = 1;

    nextPage() {
        if (this.props.jobs.length / 4 > this.currentPage) this.currentPage++;
        this.props.onClick(this.currentPage);
    }

    prevPage() {
        if (this.currentPage > 1) this.currentPage--;
        this.props.onClick(this.currentPage);
    }

    render() {
        return this.props.jobs.length / 4 > 1 ? (
            this.currentPage == 1 ? (
                this.props.jobs.length > 1 ? (
                    <Button.Info onClick={this.nextPage}>Neste side</Button.Info>
                ) : (
                    <p></p>
                )
            ) : this.props.jobs.length / 4 > this.currentPage ? (
                <div>
                    <Button.Info onClick={this.prevPage}>Forrige side</Button.Info>
                    <Button.Info onClick={this.nextPage}>Neste side</Button.Info>
                </div>
            ) : (
                <Button.Info onClick={this.prevPage}>Forrige side</Button.Info>
            )
        ) : (
            <p></p>
        );
    }
}

/**
 * Renders an information card using Bootstrap classes
 */
export class Card extends Component<{ title?: React.Node, children?: React.Node }> {
    render() {
        return (
            <div className="card mt-2 mb-2 shadow-sm ">
                <div className="card-body">
                    <h5 className="card-title">{this.props.title}</h5>
                    <div className="card-text">{this.props.children}</div>
                </div>
            </div>
        );
    }
}

export class JobInfo extends Component<{
    title: React.Node,
    content: React.Node,
    imageUrl: React.Node,
    alias: React.Node,
    dateTime: React.Node
}> {
    render() {
        return (
            <Row>
                <Column width={5}>
                    <img className={'rounded'} srcSet={this.props.imageUrl} alt="test" width="100%" />
                </Column>
                <Column width={7}>
                    <h2>{this.props.title}</h2>
                    <p>{this.props.content}</p>
                    <br />
                    <p>skrevet av {this.props.alias}</p>
                    <p>{this.props.dateTime} </p>
                </Column>
            </Row>
            //</div>
        );
    }
}

type JobListProps = {
    jobs: Job[]
};
type JobListState = {
    jobs: Job[]
};

export class JobList extends Component<JobListProps, JobListState> {
    state = {
        jobs: []
    };

    currentPage: number = 1;

    setCurrentPage(currentPage: number) {
        this.currentPage = currentPage;
        console.log('CurrentPage: ' + this.currentPage);
    }

    render() {
        if (this.state.jobs.length == 0) return null;
        else {
            return (
                <ul className={'p-0 m-0'}>
                    <Pages jobs={this.state.jobs} onClick={this.setCurrentPage} />
                    {getJobPage(this.state.jobs, this.currentPage).map(job => (
                        <li key={job.id}>
                            <Card>
                                <Row>
                                    <NavLink activeStyle={{ color: 'darkblue' }} exact to={'/jobs/' + job.id}>
                                        <JobInfo
                                            title={job.title}
                                            content={formatPreviewStr(job.content)}
                                            alias={job.alias}
                                            dateTime={formatTime(job.dateTime)}
                                            imageUrl={job.imageUrl}
                                        />
                                    </NavLink>
                                </Row>
                            </Card>
                        </li>
                    ))}
                </ul>
            );
        }
    }

    componentDidUpdate() {
        console.log('Jobblist mounted');
        if (this.props.jobs != this.state.jobs) {
            this.setState({ jobs: this.props.jobs });
        }
    }

    mounted() {
        console.log('Jobblist mounted');
        if (this.props.jobs) {
            this.setState({ jobs: this.props.jobs });
        }
    }
}

/**
 * Renders a row using Bootstrap classes
 */
export class Row extends Component<{ children?: React.Node }> {
    render() {
        return <div className="row">{this.props.children}</div>;
    }
}

/**
 * Renders a column with specified width using Bootstrap classes
 */
export class Column extends Component<{ width?: number, right?: boolean, children?: React.Node }> {
    render() {
        return (
            <div
                className={
                    'col-sm' +
                    (this.props.width ? '-' + this.props.width : '') +
                    (this.props.right ? ' text-right' : '')
                }
            >
                {this.props.children}
            </div>
        );
    }
}

class ButtonDanger extends Component<{
    onClick: () => mixed, // Any function
    children?: React.Node
}> {
    render() {
        return (
            <button type="button" className="btn btn-danger" onClick={this.props.onClick}>
                {this.props.children}
            </button>
        );
    }
}

class ButtonSuccess extends Component<{
    onClick: () => mixed, // Any function
    children?: React.Node
}> {
    render() {
        return (
            <button type="button" className="btn btn-success" onClick={this.props.onClick}>
                {this.props.children}
            </button>
        );
    }
}

class ButtonInfo extends Component<{
    onClick: () => mixed, // Any function
    children?: React.Node
}> {
    render() {
        return (
            <button type="button" className="btn btn-outline-info my-2 my-sm-0" onClick={this.props.onClick}>
                {this.props.children}
            </button>
        );
    }
}

/**
 * Renders a button using Bootstrap classes
 */
export class Button {
    static Danger = ButtonDanger;
    static Success = ButtonSuccess;
    static Info = ButtonInfo;
}
