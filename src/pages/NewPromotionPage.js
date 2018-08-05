import _ from 'lodash'
import React, { Component } from 'react'
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button,
} from 'reactstrap'
import NavBar from '../components/NavBar'
import { createPromotion, getPromotion } from '../util/api'

// XXX: Use proper currency formatter
function formatMoney(cents) {
  const val = (cents / 100).toFixed(2)
  if (_.endsWith(val, '.00')) {
    return `${Math.round(cents / 100)} €`
  }

  return `${val} €`
}

function isEmptyString(val) {
  return val === ''
}

class NewPromotionPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fixedValue: '',
      percentageValue: '',
      type: 'FIXED',
      expiresAt: '',
      promotionCode: '',
      maxAllowedUsageCount: 'unlimited',
      description: '',
      loading: false,
    }
  }

  _onInputChange = (event) => {
    this.setState({ [event.target.id]: event.target.value })
  }

  _onPromotionCodeChange = (event) => {
    const { value } = event.target
    const stripped = value.replace(/[^A-Z0-9]+/i, '')
    this.setState({ promotionCode: stripped.toUpperCase() })
  }

  _calculateValueObject() {
    if (this.state.type === 'FIXED') {
      return {
        value: Number(this.state.fixedValue),
        label: `Gift code -${formatMoney(Number(this.state.fixedValue))}`,
      }
    } else if (this.state.type === 'PERCENTAGE') {
      return {
        value: Math.round(Number(this.state.percentageValue) / 100),
        label: `Promotion -${Math.round(Number(this.state.percentageValue) * 100)} %`,
      }
    }

    throw new Error(`Unknown type: ${this.state.type}`)
  }

  _calculateLabel() {

  }

  _onSubmit = (event) => {
    event.preventDefault()

    const valueObj = this._calculateValueObject()

    const promotionCode = this.state.promotionCode.toUpperCase()
    getPromotion(promotionCode)
      .catch((err) => {
        if (err.response.status !== 404) {
          throw err
        }

        return err.response
      })
      .then((res) => {
        if (res.status !== 404) {
          throw new Error(`Promotion code ${promotionCode} already exists!`)
        }

        return createPromotion(_.omitBy({
          label: valueObj.label,
          type: this.state.type,
          value: valueObj.value,
          promotionCode: this.state.promotionCode.toUpperCase(),
          expiresAt: this.state.expiresAt,
          description: this.state.description,
          maxAllowedUsageCount: this.state.maxAllowedUsageCount === 'unlimited'
            ? undefined
            : Number(this.state.maxAllowedUsageCount),
          currency: 'EUR',
        }, isEmptyString))
      })
      .then((res) => {
        this.props.history.push('/')
      })
      .catch((err) => {
        this.setState({ loading: false })

        alert(`${err}`)
        throw err
      })
  }

  _renderValueInput() {
    if (this.state.type === 'FIXED') {
      return <FormGroup>
        <Label for="fixedValue">Value</Label>
        <InputGroup>
          <Input id="fixedValue" type="number" required value={this.state.fixedValue} onChange={this._onInputChange} placeholder="Discount as €" />
          <InputGroupAddon addonType="append">
            <InputGroupText>€</InputGroupText>
          </InputGroupAddon>
        </InputGroup>

      </FormGroup>
    }

    return <FormGroup>
      <Label for="percentageValue">Value</Label>
      <InputGroup>
        <Input id="percentageValue" type="number" required value={this.state.percentageValue} onChange={this._onInputChange} placeholder="Discount as %" />
        <InputGroupAddon addonType="append">
          <InputGroupText>%</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </FormGroup>
  }

  render() {
    return (
      <div className="NewPromotionPage">
        <NavBar />

        <Container className="NewPromotionPage__content">
          <Row className="NewPromotionPage__header-section">
            <Col>
              <h1>Create new promotion</h1>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form onSubmit={this._onSubmit}>
                <FormGroup>
                  <Label for="promotionCode">Promotion code</Label>
                  <Input id="promotionCode" type="text" required value={this.state.promotionCode} onChange={this._onPromotionCodeChange} pattern="[A-Za-z0-9]+" placeholder="E.g. SUMMER10 or SAMANTHABLOG0297" />
                </FormGroup>

                <FormGroup>
                  <Label for="type">Type</Label>

                  <Input type="select" name="type" id="type" value={this.state.type} onChange={this._onInputChange}>
                    <option value="FIXED">Fixed (€)</option>
                    <option value="PERCENTAGE">Percentage (%)</option>
                  </Input>
                </FormGroup>

                { this._renderValueInput() }

                <FormGroup>
                  <Label for="type">Max usages</Label>

                  <Input type="select" name="maxAllowedUsageCount" id="maxAllowedUsageCount" value={this.state.maxAllowedUsageCount} onChange={this._onInputChange}>
                    <option value="unlimited">Unlimited</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </Input>
                </FormGroup>

                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input id="description" type="text" value={this.state.description} onChange={this._onInputChange} placeholder="E.g. Blog collaboration" />
                </FormGroup>

                {/*
                  <FormGroup>
                    <Label for="expiresAt">Expires at</Label>
                    <Input id="expiresAt" type="date" value={this.state.expiresAt} required onChange={this._onInputChange} />
                  </FormGroup>
                */}

                <Row className="NewPromotionPage__create-container">
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
