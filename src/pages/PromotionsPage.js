import React, { Component } from 'react'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import {
  Container,
  Row,
  Col,
  Table,
  Button,
} from 'reactstrap'
import NavBar from '../components/NavBar'
import { getPromotionCodes } from '../util/api'

class PromotionsPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      promotions: [],
      loading: true,
    }
  }

  componentDidMount() {
    getPromotionCodes()
      .then((res) => {
        this.setState({
          promotions: res.data,
          loading: false,
        })
      })
      .catch((err) => {
        this.setState({ loading: false })

        alert('Error fetching promotion codes')
        throw err
      })
  }

  render() {
    return (
      <div className="PromotionsPage">
        <NavBar />

        <Container className="PromotionsPage__content">
          <Row>
            <Col>
              <h1>Promotions</h1>
            </Col>
            <Col className="PromotionsPage__new">
              <Link to="/promotions/create">
                <Button color="success">Create new promotion</Button>
              </Link>
            </Col>
          </Row>

          <Row className="PromotionsPage__table-section">
            <Col>
              <Table>
                <thead>
                  <tr>
                    <th>Promotion code</th>
                    <th>Value</th>
                    <th>Usages</th>
                    <th>Expires at</th>
                    <th>Created at</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    _.map(this.state.promotions, (promotion) =>
                      <tr key={promotion.promotionCode}>
                        <td>{promotion.promotionCode}</td>
                        <td>{(promotion.value / 100).toFixed(2)} €</td>
                        <td>{promotion.usageCount} / {promotion.maxAllowedUsageCount}</td>
                        <td>{promotion.expiresAt}</td>
                        <td>{promotion.createdAt}</td>
                      </tr>
                    )
                  }
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default PromotionsPage;
