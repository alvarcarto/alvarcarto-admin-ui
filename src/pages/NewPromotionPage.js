import _ from 'lodash'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from 'reactstrap'
import NavBar from '../components/NavBar'
import { createNewPromotion } from '../util/api'

function isEmptyString(val) {
  return val === '';
}

class NewPromotionPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: '',
      type: 'FIXED',
      expiresAt: '',
      promotionCode: '',
      maxAllowedUsageCount: '1',
      loading: false,
    }
  }

  _onInputChange = (event) => {
    this.setState({ [event.target.id]: event.target.value })
  }

  _onPromotionCodeChange = (event) => {
    const { value } = event.target
    const stripped = value.replace(/[^A-Z0-9]+/i, '')
    this.setState({ promotionCode: stripped })
  }

  _onSubmit = (event) => {
    event.preventDefault()

    const label = this.state.type === 'FIXED'
      ? `Gift code -${(this.state.value / 100).toFixed(2)}`
      : `Promotion -${Math.round(this.state.value * 100)} %`

    createNewPromotion(_.omitBy({
      label: label,
      type: this.state.type,
      value: Number(this.state.value),
      promotionCode: this.state.promotionCode.toUpperCase(),
      expiresAt: this.state.expiresAt,
      maxAllowedUsageCount: Number(this.state.maxAllowedUsageCount),
      currency: 'EUR',
    }, isEmptyString))
      .then((res) => {
        this.props.history.push('/')
      })
      .catch((err) => {
        alert(`Error creating promotion: ${err}`)
        throw err
      })
      .finally(() => this.setState({ loading: false }))
  }

  render() {
    return (
      <div className="NewPromotionPage">
        <NavBar />

        <Container className="NewPromotionPage__content">
          <Row>
              <Col>
                <h1>Create new promotion</h1>
              </Col>
            </Row>

          <Row>
            <Col>
              <Form onSubmit={this._onSubmit}>
                <FormGroup>
                  <Label for="promotionCode">Promotion code</Label>
                  <Input id="promotionCode" type="text" required value={this.state.promotionCode} onChange={this._onPromotionCodeChange} pattern="[A-Za-z0-9]+" placeholder="E.g. SUMMER10 (Only letters and numbers)" />
                </FormGroup>

                <FormGroup>
                  <Label for="type">Type</Label>

                  <Input type="select" name="type" id="type" value={this.state.type} onChange={this._onInputChange}>
                    <option value="FIXED">Fixed</option>
                    <option value="PERCENTAGE">Percentage</option>
                  </Input>
                </FormGroup>

                <FormGroup>
                  <Label for="value">Value</Label>
                  <Input id="value" type="number" required value={this.state.value} onChange={this._onInputChange} />
                </FormGroup>

                <FormGroup>
                  <Label for="type">Max usages</Label>

                  <Input type="select" name="maxAllowedUsageCount" id="maxAllowedUsageCount" value={this.state.maxAllowedUsageCount} onChange={this._onInputChange}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </Input>
                </FormGroup>

                {/*
                  <FormGroup>
                    <Label for="expiresAt">Expires at</Label>
                    <Input id="expiresAt" type="date" value={this.state.expiresAt} required onChange={this._onInputChange} />
                  </FormGroup>
                */}

                <Row>
                  <Col sm={{ size: 'auto' }}>
                    <Button color="primary" disabled={this.state.loading}>
                      { this.state.loading ? 'Creating..' : 'Create new promotion' }
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default NewPromotionPage
