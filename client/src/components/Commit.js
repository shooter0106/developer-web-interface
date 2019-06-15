import React from 'react';
import { connect } from 'react-redux';
import { UncontrolledCollapse, CardBody, Card, CardHeader } from 'reactstrap';
import { loadCommits } from '../redux/actions';
import Branches from './Branches';
import './styles/Commit.css';
import Loading from './Loading';

class CommitsGrid extends React.Component {
	componentDidMount() {
		this.props.loadCommits();
	}
	renderCommits = commit => {
		let tog = 'toggler' + commit.sha;
		let committerDate = new Date(commit.commit.committer.date);
		let authorDate = new Date(commit.commit.author.date);
		let author = encodeURIComponent(commit.commit.author.name);
		let committer = encodeURIComponent(commit.commit.committer.name);
		return (
			<div className='panel-margin' key={commit.sha}>
				<Card>
					<CardHeader className='new' type='button' id={tog}>
						<div className='row'>
							<div className='col-sm'>{commit.sha.substring(0, 7)}</div>
							<div className='col-sm'>{commit.commit.committer.name}</div>
							<div className='col-sm'>{committerDate.toLocaleString()}</div>
							<div className='col-sm'>
								{commit.commit.message.substring(0, 17)}...
							</div>
						</div>
					</CardHeader>
					<UncontrolledCollapse toggler={tog}>
						<CardBody className='indent'>
							<div>
								<p>
									<strong>commit: </strong>{' '}
									<a
										target='_blank'
										rel='noreferrer noopener'
										href={commit.html_url}
									>
										{commit.sha}
									</a>
								</p>
								<p>
									<strong>Commit Msg:</strong> {commit.commit.message}
								</p>
							</div>
							<div className='row'>
								<div className='col-sm'>
									<strong>Author: </strong>
									<a
										target='_blank'
										rel='noreferrer noopener'
										href={`https://git.reactos.org/?p=reactos.git;a=search;s=${author};st=author`}
									>
										{commit.commit.author.name}
									</a>
								</div>
								<div className='col-sm'>
									<strong>Author Date: </strong>
									{authorDate.toLocaleString()}
								</div>
								<div className='col-sm'>
									<strong>Author Email: </strong>
									<a
										href={`mailto:${commit.commit.author.email}`}
										target='_top'
									>
										{commit.commit.author.email}
									</a>
								</div>
							</div>
							<div className='row'>
								<div className='col-sm'>
									<strong>Committer: </strong>
									<a
										target='_blank'
										rel='noreferrer noopener'
										href={`https://git.reactos.org/?p=reactos.git;a=search;s=${committer};st=committer`}
									>
										{commit.commit.committer.name}
									</a>
								</div>
								<div className='col-sm'>
									<strong>Committer Date: </strong>
									{committerDate.toLocaleString()}
								</div>
								<div className='col-sm'>
									<strong>Committer Email: </strong>
									<a
										href={`mailto:${commit.commit.committer.email}`}
										target='_top'
									>
										{commit.commit.committer.email}
									</a>
								</div>
							</div>
						</CardBody>
					</UncontrolledCollapse>
				</Card>
			</div>
		);
	};

	render() {
		return (
			<div>
				<div className='container margin'>
					<Branches />
					<h6>Current Branch:{this.props.branch}</h6>
					<h3>Latest Commits</h3>
					{this.props.isLoading.load ? (
						<div>
							<div>
								Fetching latest Commits of <strong>{this.props.branch} </strong>
								for you...
								<Loading />
							</div>
						</div>
					) : (
						<div>
							<div>{this.props.commits.map(this.renderCommits)}</div>
							{this.props.commitError !== null ? (
								' '
							) : (
								<div>
									<button
										type='button'
										onClick={() => {
											this.props.loadCommits(this.props.commitPage.prev);
										}}
										className='btn btn-primary '
										disabled={
											this.props.commitPage.prev === null ||
											this.props.commitError !== null
												? true
												: false
										}
									>
										<i className='fa fa-caret-left' aria-hidden='true' />
										Previous Page{' '}
									</button>{' '}
									<button
										type='button'
										onClick={() => {
											this.props.loadCommits(this.props.commitPage.next);
										}}
										className='btn btn-primary'
										disabled={
											this.props.commitPage.next === null ||
											this.props.commitError !== null
												? true
												: false
										}
									>
										Next Page{'	'}
										<i className='fa fa-caret-right' aria-hidden='true' />
									</button>
									<div className='foter'>
										Page {this.props.commitPage.next - 1}
									</div>
								</div>
							)}
						</div>
					)}
					{this.props.commitError && (
						<div className='error'>
							Unexpected Error occured. Kindly Reload the page
							<br />
							Err:{this.props.commitError}
						</div>
					)}
				</div>
			</div>
		);
	}
}

// prettier-ignore
const mapStateToProps = ({ isLoading, commits, commitError, branch,commitPage }) => ({
	isLoading,
	commits,
	commitError,
	branch,
	commitPage
});

const mapDispatchToProps = dispatch => ({
	loadCommits: next => {
		dispatch(loadCommits(next));
	}
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CommitsGrid);
