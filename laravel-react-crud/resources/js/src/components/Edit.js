import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import AppContainer from './AppContainer'
import api from '../api'
import { onEditSubmit } from '../actions'
import { connect } from 'react-redux'

const Edit = (props)=>{
    const { id } = useParams()
    const history = useHistory()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const handleSubmit = async()=>{
        props.onEditSubmit(
            id,
            title,
            description,
            history
        )
    } 

    useEffect(()=>{
        api.getOnePost(id)
        .then(res=>{
            const result = res.data;
            const post = result.data
            setTitle(post.title)
            setDescription(post.description)
        })
    },[])

    return (
        <AppContainer title="Edit POST">
            <form>
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" className="form-control" value={title} onChange={e=>setTitle(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea  className="form-control" value={description} onChange={e=>setDescription(e.target.value)}></textarea>
                </div>
                <div className="form-group">
                    <button type="button" onClick={handleSubmit} disabled={props.loading} className="btn btn-success">
                        {props.loading ? 'Loaging' : 'Edit'}
                    </button>
                </div>
            </form>
        </AppContainer>
    );
}

const mapStateToProps = (state)=>{
    return {
        loading: state.loading
    }
}

const mapActionToProps = {
    onEditSubmit
}

export default connect(mapStateToProps,mapActionToProps)(Edit)  