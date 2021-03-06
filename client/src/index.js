// @flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import { Alert, NavBar, Card, Row, Column, Button, JobInfo, Filters, MessageInfo, Pages, JobList } from './widgets';
import { Job, jobService, Message, messageService } from './services';

import { createHashHistory } from 'history';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

function formatTime(dateTime: string) {
    return dateTime.split(':')[0] + ':' + dateTime.split(':')[1];
}

class Menu extends Component {
    render() {
        return (
            <div>
                <NavBar brand="Småjobber">
                    <NavBar.Link to={'/category/transport'}>Transport</NavBar.Link>
                    <NavBar.Link to="/category/handverk">Håndverk</NavBar.Link>
                    <NavBar.Link to={'/category/diverse'}>Diverse</NavBar.Link>
                    <Button.Info onClick={() => history.push('/newjob')}>Legg ut ny jobb</Button.Info>
                </NavBar>
                <LiveFeed />
            </div>
        );
    }
}

class Home extends Component {
    render() {
        return (
            <div className={'pt-3'}>
                <Row>
                    <Column width={3}>
                        <Filters />
                    </Column>
                    <Column>
                        <FrontPage />
                    </Column>
                </Row>
            </div>
        );
    }
}

type Props = {
    //Nødvendig for å unngå flow feil..
};
type State = {
    jobs: Array<Job>
};

class LiveFeed extends Component<Props, State> {
    intervalID = 1;
    timeoutID: ?TimeoutID = null;

    state = {
        jobs: []
    };

    getCarouselClassName(indx: number) {
        return indx == 0 ? 'carousel-item active' : 'carousel-item';
    }

    render() {
        if (!this.state.jobs) return null;
        else {
            return (
                <div>
                    <div className="carousel slide" data-ride="carousel">
                        <div className="carousel-inner text-center">
                            {this.state.jobs.map((job, indx) => {
                                return (
                                    <div key={job.id} className={this.getCarouselClassName(indx)}>
                                        <div className="d-flex h-100 align-items-center justify-content-center">
                                            <NavLink to={'/jobs/' + job.id}>
                                                <p>{job.title}</p>
                                                <p>{formatTime(job.dateTime)}</p>
                                            </NavLink>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        }
    }

    componentDidMount() {
        this.getData();
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutID);
    }

    getData = () => {
        jobService
            .getNewestJobs()
            .then(jobs => this.setState({ jobs: jobs }))
            .catch((error: Error) => Alert.danger(error.message));
        this.timeoutID = setTimeout(this.getData.bind(this), 5000);
    };
}

class JobListCategory extends Component<{ match: { params: { category: string } } }> {
    jobs: Job[] = [];

    render() {
        if (this.jobs.length > 0) {
            return <JobList jobs={this.jobs} />;
        } else return null;
    }

    mounted() {
        jobService
            .getCategory(this.props.match.params.category)
            .then(jobs => (this.jobs = jobs))
            .catch((error: Error) => Alert.danger(error.message));
    }
}

class SearchResults extends Component<{ match: { params: { keyword: string } } }> {
    jobs: Job[] = [];

    render() {
        if (this.jobs.length > 0) {
            return <JobList jobs={this.jobs} />;
        } else return null;
    }

    mounted() {
        jobService
            .searchJobs(this.props.match.params.keyword)
            .then(jobs => (this.jobs = jobs))
            .catch((error: Error) => Alert.danger(error.message));
    }
}

class FrontPage extends Component {
    jobs: Job[] = [];

    render() {
        if (this.jobs.length > 0) {
            return <JobList jobs={this.jobs} />;
        } else return null;
    }

    mounted() {
        jobService
            .getJobs()
            .then(jobs => (this.jobs = jobs.filter(job => job.importance == 1)))
            .catch((error: Error) => Alert.danger(error.message));
    }
}

class JobDetails extends Component<{ match: { params: { id: number } } }> {
    job: Job = new Job();

    render() {
        if (this.job != null && this.job.dateTime) {
            return (
                <div>
                    <Card>
                        <JobInfo
                            title={this.job.title}
                            content={this.job.content}
                            alias={this.job.alias}
                            dateTime={formatTime(this.job.dateTime)}
                            imageUrl={this.job.imageUrl}
                        />
                        <NavLink exact to={'/jobs/' + this.job.id + '/edit/'}>
                            rediger
                        </NavLink>
                    </Card>
                    <MessageBoard job_id={this.job.id} />
                </div>
            );
        } else {
            return null;
        }
    }

    mounted() {
        jobService
            .getJob(this.props.match.params.id)
            .then(job => (this.job = job))
            .catch((error: Error) => Alert.danger(error.message));
    }
}

class MessageBoard extends Component<{ job_id: number }> {
    messages: Message[] = [];
    message: Message = new Message();

    render() {
        if (!this.messages) return null;
        return (
            <div>
                <Card title={'Meldinger'}>
                    <ul>
                        {this.messages.map(m => (
                            <MessageInfo from={m.alias} message={m.content} dateTime={m.dateTime} id={m.id} />
                        ))}
                    </ul>
                </Card>
                <div className="p-5 container w-auto width w-100" id={'newMessageInputs'}>
                    <Card title={'Ny melding:'}>
                        <Row>
                            <Column>
                                <input
                                    className={'rounded'}
                                    value={this.message.alias}
                                    type="text"
                                    placeholder="alias her:"
                                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) =>
                                        (this.message.alias = event.target.value)
                                    }
                                />
                            </Column>
                        </Row>
                        <Row>
                            <Column>
                                <textarea
                                    className={'rounded'}
                                    value={this.message.content}
                                    id={'messageContent'}
                                    placeholder="melding her:"
                                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) =>
                                        (this.message.content = event.target.value)
                                    }
                                />
                            </Column>
                        </Row>
                        <Row>
                            <Column>
                                <Button.Success onClick={this.submit}>Send</Button.Success>
                            </Column>
                        </Row>
                    </Card>
                </div>
            </div>
        );
    }

    mounted() {
        messageService
            .getMessages(this.props.job_id)
            .then(messages => (this.messages = messages))
            .catch((error: Error) => Alert.danger(error.message));
        this.message.content = '';
    }

    submit() {
        console.log('submitting message');
        this.message.job_id = this.props.job_id;
        messageService
            .postMessage(this.message)
            .then(() => {
                let messageBoard = MessageBoard.instance();
                if (messageBoard) messageBoard.mounted();
                this.message = new Message();
                history.push('/jobs/' + this.props.job_id);
            })
            .catch((error: Error) => Alert.danger(error.message));
    }
}

class JobEdit extends Component<{ match: { params: { id?: number } } }> {
    //Brukes også for ny jobb
    job: Job = new Job();
    title: string = 'Rediger';
    editingExistingJob: boolean = true;

    render() {
        if (!this.job) return null;
        return (
            <Card title={this.title}>
                <form>
                    <Row>
                        <Column width={2}>tittel:</Column>
                        <Column>
                            <input
                                type="text"
                                value={this.job.title}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {
                                    if (this.job) this.job.title = event.target.value;
                                }}
                            />
                        </Column>
                    </Row>
                    <Row>
                        <Column width={2}>innhold:</Column>
                        <Column>
                            <textarea
                                type="text"
                                value={this.job.content}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {
                                    if (this.job) this.job.content = event.target.value;
                                }}
                            />
                        </Column>
                    </Row>
                    <Row>
                        <Column width={2}>bildelenke:</Column>
                        <Column>
                            <input
                                type="text"
                                value={this.job.imageUrl}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {
                                    if (this.job) this.job.imageUrl = event.target.value;
                                }}
                            />
                        </Column>
                    </Row>
                    <Row>
                        <Column width={2}>kategori:</Column>
                        <Column>
                            <select
                                value={this.job.category}
                                onChange={event => {
                                    if (this.job) this.job.category = event.target.value;
                                }}
                            >
                                <option value="transport">transport</option>
                                <option value="handverk">håndverk</option>
                                <option value="diverse">diverse</option>
                            </select>
                        </Column>
                    </Row>
                    <Row>
                        <Column width={2}>alias:</Column>
                        <Column>
                            <input
                                type="text"
                                value={this.job.alias}
                                onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {
                                    if (this.job) this.job.alias = event.target.value;
                                }}
                            />
                        </Column>
                    </Row>
                    <Row>
                        <Column width={2}>viktighet:</Column>
                        <Column>
                            <select
                                onChange={event => {
                                    if (this.job) this.job.importance = event.target.value;
                                }}
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                            </select>
                        </Column>
                    </Row>

                    <Button.Success onClick={this.save}>Lagre</Button.Success>
                    {this.editingExistingJob ? <Button.Danger onClick={this.delete}>Slett</Button.Danger> : <p></p>}
                </form>
            </Card>
        );
    }

    mounted() {
        this.props.match.params.id ? (this.editingExistingJob = true) : (this.editingExistingJob = false);

        this.props.match.params.id
            ? jobService
                .getJob(this.props.match.params.id)
                .then(job => (this.job = job))
                .catch((error: Error) => Alert.danger(error.message))
            : (this.title = 'Registrer ny jobb');
        this.job = new Job();
        this.job.importance = 1;
    }

    save() {
        if (!this.job) return null;
        (this.editingExistingJob ? jobService.updateJob(this.job) : jobService.postJob(this.job))
            .then(() => {
                let joblist = JobList.instance();
                if (joblist) joblist.mounted();
                this.job.id ? history.push('/jobs/' + this.job.id) : history.push('/');
                Alert.info("Jobben ble lagret!");
            })
            .catch((error: Error) => {
                Alert.danger("Ops det oppstod en feil: " + error.message);
            })
    }

    delete() {
        if (!this.job) return null;
        jobService
            .deleteJob(this.job)
            .then(() => {
                let joblist = JobList.instance();
                if (joblist) joblist.mounted();
                if (this.job) history.push('/');
                Alert.info("Jobben ble slettet!");
            })
            .catch((error: Error) => Alert.danger("Ops det oppstod en feil: " + error.message));
    }
}

const root = document.getElementById('root');
if (root)
    ReactDOM.render(
        <HashRouter>
            <div>
                <Alert />
                <Menu />
                <Route exact path="/" component={Home} />
                <Route exact path="/jobs/" component={JobList} />
                <Route exact path="/jobs/:id" component={JobDetails} />
                <Route exact path="/jobs/:id/edit" component={JobEdit} />
                <Route exact path="/newjob/" component={JobEdit} />
                <Route exact path="/category/:category" component={JobListCategory} />
                <Route exact path="/search/:keyword" component={SearchResults} />
            </div>
        </HashRouter>,
        root
    );
